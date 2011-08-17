(function($){
  $.fn.shuffle = function() {
    return this.each(function(){
      var items = $(this).children();
      return (items.length)
        ? $(this).html($.shuffle(items))
        : this;
    });
  }

  $.shuffle = function(arr) {
    for(
      var j, x, i = arr.length; i;
      j = parseInt(Math.random() * i),
      x = arr[--i], arr[i] = arr[j], arr[j] = x
    );
    return arr;
  }
})(jQuery);

function FriendListHack() {
    var DEBUG = false;
    var APP_ID = "156596367751193";

    var FB_PIC_URL = "https://graph.facebook.com/%%ID%%/picture?type=large";
    var FB_MINI_URL = "https://graph.facebook.com/%%ID%%/picture";

    var _me;

    var _pickLimit = 5;

    var _friends = [];
    var _guys = [];
    var _girls = [];
    var _friendlists = [];
    var _buttons = [];
    var _audience = [];
    var _sorted = [];
    var _allFriendsInLists = [];
    var _allFriendsNotInLists = [];
    var _pickedLists = [];

    var _currentPerson;
    var _nextPerson;
    var _nextImage;

    var _accessToken;

    var _loaded = 0;
    var _state = 0;

    /***********************************************
     * Functions
     ***********************************************/
    function showNextPerson() {
        function loadNextPerson(){
            _nextPerson = _audience.shift();
            _nextImage = $('<img />').attr('src', FB_PIC_URL.replace("%%ID%%", _nextPerson.id));
        }
        if (!_nextPerson){
            //first time
            loadNextPerson();
        }
        if (_nextPerson){
            _currentPerson = _nextPerson;
            // $("#sortButtonContainer").children().each(function(i, button){
            //     $(_friendlists).each(function(j, friendlist){
            //         if (button.attr('dataid') == friendlist.id){
            //             $(button).removeClass("blue red green");
            //             if($.grep(friendlist.members, function (a) { return a.id == _currentPerson.id; }).length){
            //                 console.log(_currentPerson.name+" is in "+friendlist.name);
            //                 $(button).addClass("red").html("Remove from " + friendlist.name+" [Press "+(i+1)+"]");
            //             }else{
            //                 $(button).addClass("green").html("Add to " + friendlist.name+" [Press "+(i+1)+"]");
            //             }
            //         }else{
            //             console.log(button.attr('dataid') + " != " + friendlist.id);
            //         }
            //     });
            // });
            $("#profileNameContainer").html(_currentPerson.name);
            $("#profilePictureContainer").html(_nextImage);
            $("#sortingInfoContainer").html(_audience.length + " friends left to sort");
            if (_audience.length > 0){
                loadNextPerson();
            }
        }else{
            $("#friendContainer").html("You are finished!");
        }
    }

    function getReady(){
        $("#getStartedButton").click(function() {
            console.log('clicked button!');
            _state = 1;
            $("#infoContainer").fadeOut('fast');
            $("#friendListContainer").fadeIn('fast');
            $("#logoImage").animate({height: 75}, 400);
            _currentButton = $("#doneListButton");
            return false;
        }).html("Get Started!").addClass("green").removeClass("white bigrounded");
    }

    function setAudience(){
        console.log("setting audience");
        // _audience = _friends;

        var _tempFriends = _guys;
        $.merge(_tempFriends, _girls);

        $(_friendlists).each(function(){
            $.merge(_allFriendsInLists, this.members);
        });

        _allFriendsNotInLists = _.difference(_tempFriends, _allFriendsInLists);

        if ($("#listed input:checked").val() == "not"){
            console.log("not in list only")
            _tempFriends = _allFriendsNotInLists;
        }

        if ($("#gender input:checked").val() == "guys"){
            console.log("guys only")
            _tempFriends = _.intersection(_tempFriends, _guys);
        }else if ($("#gender input:checked").val() == "girls"){
            console.log("girls only")
            _tempFriends = _.intersection(_tempFriends, _girls);
        }
        _audience = $.shuffle(_tempFriends);

    }

    /***********************************************
     * Load
     ***********************************************/
    function loadProfilePreferences() {
        FB.api('/me', function(response) {
            _me = response;
            $("#userName").html(_me.name);
             _loaded += 1;
             if (_loaded == 3){
                 getReady();
             }
        });
    }

    function loadFriends(){
        FB.api('/me/friends?fields=name,gender', function(response) {
            _friends = response.data;
            $.each(_friends, function(){
                var newFriend = new Object();
                newFriend.id = this.id;
                newFriend.name = this.name;
                if (this.gender == "male"){
                    _guys.push(newFriend);
                }else{
                    _girls.push(newFriend);
                }
            });
            $("#infoFriends").html("You have "+_friends.length+" friends");
            $("#audienceInfoContainer").html("You have "+_friends.length+" friends,"+_guys.length+"guys & "+_girls.length+" girls");
            _loaded += 1;
            if (_loaded == 3){
                getReady();
            }
        });
    }

    function loadFriendLists(){
        console.log("loading friendlists ...");
        FB.api('/me/friendlists', function(response) {
            $("#sortButtonContainer").html("");
            $("#friendListTable").html("");
            _friendlists = response.data;
            $.each(_friendlists, function(){
                loadFriendListMembers(this);
                addRowToTableInID(this, "#friendListContainer");
                // addFriendListSelectToID(this, "#friendList");
                // addSortButtonToID(this, "#sortButtonContainer");
                // addDeleteButtonToID(this, "#deleteFriendListButtonContainer");
            })
            $("#infoFriendLists").html("& "+_friendlists.length+" friendlists.");
            _loaded+=1;
            if (_loaded == 3){
                getReady();
            }
        });
    }

    function loadFriendListMembers(friendlist){
        console.log(friendlist.name+' loading...');
        FB.api('/'+friendlist.id+'/members', function(response) {
            friendlist.members = response.data;
        });
    }

    /***********************************************
     * Add Functions
     ***********************************************/

    function addPickedSortButtons(){
        $('a[datapicked="true"]').each(function(){
            var friendlist = new Object();
            friendlist.id = $(this).attr('dataid');
            friendlist.name = $(this).attr('dataname');
            console.log(friendlist);
            addSortButtonToID(friendlist, "#sortButtonContainer");
        });
    };

    function addRowToTableInID(friendlist, id){

        var pickButton = $(document.createElement("a"))
            .attr({href:"",
                dataid:friendlist.id,
                dataname:friendlist.name,
                datapicked:false})
            .addClass("button white medium")
            .html("Pick " + friendlist.name)
            .click(onPickButton);

        var deleteButton = $(document.createElement("a"))
            .attr({href:"",dataid:friendlist.id, dataname:friendlist.name})
            .addClass("button red small")
            .html("Delete " + friendlist.name)
            .click(onDeleteCurrentButton);

            var newRow = $(document.createElement("tr")).append(
                $(document.createElement("td")).html(pickButton),
                $(document.createElement("td")).html(deleteButton)
            ).appendTo("#friendListTable");

    }

    function addFriendListSelectToID(friendlist, id){
        var newCheckBox = $(document.createElement("input"))
            .attr(
                {id:"select"+friendlist.id,
                type:"checkbox",
                dataid:friendlist.id,
                dataname:friendlist.name,
                name:"audience",
                value:friendlist.id,
                checked:"checked"})
            .click(function(event){
                onAudienceSelect(event);
            }).appendTo(id);
        var newLabel = $(document.createElement("label"))
            .attr({for:"select"+friendlist.id})
            .html(friendlist.name)
            .appendTo(id);
    }


    function addAudienceSelectToID(friendlist, id){
        var newCheckBox = $(document.createElement("input"))
            .attr({type:"checkbox", dataid:friendlist.id, dataname:friendlist.name, name:"audience", value:friendlist.id, checked:"checked"})
            .click(function(event){
                onAudienceSelect(event);
            }).appendTo(id);
    }

    function addPickButtonToID(friendlist, id){
        var newButton = $(document.createElement("a"))
            .attr({href:"",
                dataid:friendlist.id,
                dataname:friendlist.name,
                datapicked:false})
            .addClass("button white medium")
            .html(friendlist.name)
            .click(onPickButton)
            .appendTo(id);
    }

    function addSortButtonToID(friendlist, id){
        console.log("addSortButtonToId");
        console.log(friendlist);
        var newButton = $(document.createElement("a"))
            .attr({href:"",dataid:friendlist.id, dataname:friendlist.name})
            .addClass("button blue big")
            .html("+" + friendlist.name+" ["+($(id).children().length+1)+"]")
            .click(onAddCurrentButton)
            .appendTo(id);
    }

    function addDeleteButtonToID(friendlist, id){
        var newButton = $(document.createElement("a"))
            .attr({href:"",dataid:friendlist.id, dataname:friendlist.name})
            .addClass("button red small")
            .html("Delete " + friendlist.name)
            .click(onDeleteCurrentButton)
            .appendTo(id);
    }

    /***********************************************
     * Handlers
     ***********************************************/
    function onAudienceSelect(event){
        var friendlistid = event.currentTarget.attributes['dataId'].value;
        var friendlistname = event.currentTarget.attributes['dataName'].value;
        console.log(event.currentTarget.checked);
    }

    function onPickButton(event){
        var friendlistid = event.currentTarget.attributes['dataId'].value;
        var friendlistname = event.currentTarget.attributes['dataName'].value;
        var picked = event.currentTarget.attributes['datapicked'].value;

        console.log(picked);

        if (picked == 'true'){
            $(event.currentTarget).attr('datapicked', false).removeClass("green").addClass("white").html("Pick "+ $(event.currentTarget).attr('dataname'));
        }else{
            if ($('a[datapicked="true"]').length < _pickLimit){
                $(event.currentTarget).attr('datapicked', true).removeClass("white").addClass("green").html("Unpick "+ $(event.currentTarget).attr('dataname'));
            }else{
                var msg = $(document.createElement("span"))
                    .html("You picked 5 lists to sort to already, we recommend picking only 5.")
                    .addClass("warn")
                    .appendTo("#warningTooManyContainer")
                    .delay(800).fadeOut('fast',function() { $(this).remove(); });
            }
        }

        return false;
    }

    function onAddCurrentButton(event){
        if (_currentPerson){
            var friendlistid = event.currentTarget.attributes['dataId'].value;
            var friendlistname = event.currentTarget.attributes['dataName'].value;
            var url = "https://graph.facebook.com/"+friendlistid+"/members/"+_currentPerson.id;
            $.post(url+'?access_token='+_accessToken);
        }
        showNextPerson();
        return false;
    }

    function onDeleteCurrentButton(event){
        var friendlistid = event.currentTarget.attributes['dataId'].value;
        var friendlistname = event.currentTarget.attributes['dataName'].value;
        var answer = confirm("Do you really want to delete "+friendlistname+"?");
        if (answer){
            $.post("https://graph.facebook.com/"+friendlistid+'/?method=DELETE&access_token='+_accessToken);
            $(event.currentTarget).fadeOut('fast', function(){
                $(this).remove();
            });
        }
        return false;
    }

    function onKeyPress(e){
        switch(String.fromCharCode(e.which)) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                if(_state >= 3){
                    var keyNum = e.which-49;
                    console.log($("#sortButtonContainer").children().length+"..."+keyNum);
                    if ($("#sortButtonContainer").children().length > keyNum){
                        $("#sortButtonContainer").children()[keyNum].click();
                    }
                }
                break;
            case 'k':
                console.log("k is pressed")
                break;
            case 'b':
                console.log("b is pressed")
                break;
            case 'm':
                console.log("m is pressed")
                break;
            default:
                if (e.which == 8 && _state > 0){
                    $(".cancel").click();
                }else if (e.which == 13 && _state < 3){
                    if(_currentButton){
                        _currentButton.click();
                    }
                }else if (e.which == 32 && _state >= 3){
                    showNextPerson();
                }
                else{
                    console.log(e.which);
                }
        };
    }

    function onFacebookStatusChange(response) {
        var perms = $.parseJSON(response.perms);
        var notEnough = false;
        if (perms){
            var manage = $.inArray("manage_friendlists",perms.extended);
            var read = $.inArray("read_friendlists",perms.extended);
            if (manage == -1 || read == -1){
                notEnough  = true;
            }
        }
        if (response.status != "connected" || !response.session || notEnough) {
            $("#loginContainer").show();
            $("#infoContainer").hide();
            $("#friendListContainer").hide();
            $("#audienceContainer").hide();
            $("#friendContainer").hide();
            console.log("not connected")
        } else {
            _accessToken = response.session.access_token;
            //logged in, query shitttzzz
            loadProfilePreferences();
            loadFriends();
            loadFriendLists();
            // User is logged in
                $("#loginContainer").hide();
            if (!DEBUG){
                $("#friendListContainer").hide();
                $("#audienceContainer").hide();
                $("#friendContainer").hide();
            }else{
                $(".container").show();
            }
            $("#infoContainer").show();
            console.log("connected ")
        }
    }

    /***********************************************
     * Initialization
     ***********************************************/
    function initApplication() {
        _currentButton = $("#getStartedButton");
        $("#getStartedButton").click(function() {
            return false;
        });
        $("#doneListButton").click(function() {
            _state = 2;
            console.log("hiding friendListContainer");
            console.log("showing audienceContainer");
            $("#friendListContainer").fadeOut('fast');
            $("#audienceContainer").fadeIn('slow');
            _currentButton = $("#doneAudienceButton");
            addPickedSortButtons();
            return false;
        });
        $("#doneAudienceButton").click(function() {
            _state = 3;
            $("#audienceContainer").fadeOut('fast');
            $("#friendContainer").fadeIn('slow');
            _currentButton = null;
            setAudience();
            showNextPerson();
            return false;
        });
        $("#addNewFriendListButton").click(function() {
            var s = prompt('New Friend List name');
            var url = "https://graph.facebook.com/me/friendlists/";
            $.post(url+'?access_token='+_accessToken, {name:s}, function(data){
                console.log(data);
                loadFriendLists();
            });
            console.log("adding new friendlist "+ s);
            return false;
        });
        $("#addNewFriendListWhileButton").click(function() {
            var s = prompt('New Friend List name');
            var url = "https://graph.facebook.com/me/friendlists/";
            $.post(url+'?access_token='+_accessToken, {name:s});
            loadFriendLists();
            return false;
        });
        $(".cancel").click(function(){
            console.log(_state);
            if (_state != 0){
                _state = 0;
                $("#loginContainer").hide();
                $("#infoContainer").show();
                $("#friendListContainer").hide();
                $("#audienceContainer").hide();
                $("#friendContainer").hide();
                $("#logoImage").animate({height: "180px"}, 400);
                _currentButton = $("#getStartedButton");
            }
            return false;
        });
        registerKeyboard();
        initFacebook();
    }

    function registerKeyboard(){
        $(document).keypress(function(e) {
            onKeyPress(e);
        });
    }

    function initFacebook() {
        FB.init({
            appId  : APP_ID,
            status : true,
            cookie : true,
            xfbml  : true
        });
        FB.Canvas.setAutoResize();
        FB.Event.subscribe('auth.statusChange', onFacebookStatusChange);
        // FB.getLoginStatus(onFacebookStatusChange);

        console.log("initFacebook done...");
    }

    $(initApplication);
}

var app = new FriendListHack();