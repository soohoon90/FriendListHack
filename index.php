<!doctype html>
<html xmlns:fb="http://www.facebook.com/2008/fbml">
  <head>
    <script src="http://connect.facebook.net/en_US/all.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.15/jquery-ui.min.js"></script>
    <script src="js/underscore-min.js"></script>
    <script src="js/friendlisthack.js"></script>
    <link rel='stylesheet' href='css/button.css' />
    <link rel='stylesheet' href='css/style.css' />
  </head>

  <body>
    <div id="pageContainer" class="container">
      <div id="headerContainer">
        <img id="logoImage" src="img/friendlisthack.png">
        <h1>Friend List Hack</h1>
      </div>
      <div id="fb-root">
        <div id="loginContainer" class="container">
          <fb:login-button perms="read_friendlists,manage_friendlists"></fb:login-button>
        </div>
      </div>
      <div id="infoContainer" class="container inner yellow">
        <h2>Sort your friends quickly!</h2>
        <p>Welcome <span id="userName"></span>! <span id="infoFriends"></span> <span id="infoFriendLists"></span> Friend List Hack allows you to go through entire list of friends and sort them into friend lists super easy and super quickly!</p>
        <h3>3 Simple Steps:</h3>
        <ol>
          <li>Define friend lists to sort to</li>
          <li>Choose group of friends to sort</li>
          <li>Use quick and easy keyboard shortcuts to sort your friends!</li>
        </ol>
        <div class="marginal"><a href="" id="getStartedButton" class="button red bigrounded">Fetching Data...</a></div>
      </div>
      <div id="friendListContainer" class="container inner yellow">
        <h3>1. Pick up to 5 friend list to sort into:</h3>
        <!-- <div id="tryTipContainer">
          <ul>Picking related lists are a good idea.
            <li>If you are sorting friends by where you met them, try to include all major timezone difference.</li>
            <li>Sorting friends into work friends, school friends and close friends can be useful </li>
            <li>Epic bros, roommates, family, fellow photographers, are other good suggestions </li>
            <li>Have you played KBM before? You can do that here too :) </li>
          </ul>
        </div> -->
        <div id="warningTooManyContainer"></div>
        <div class="marginal">
          <table>
            <thead>
              <tr>
                <th><h3>Pick</h3></th>
                <th><h3>Remove</h3></th>
              </tr>
            </thead>
            <tbody id="friendListTable">
            </tbody>
          </table>
        </div>
        <div class="marginal">
          <h3>can't find list you like? add a new Friend List</h3>
          <a href="" id="addNewFriendListButton" class="button rosy">Add a new Friend List</a>
        </div>
        <div class="marginal">
          <a href="" id="doneListButton" class="button green">Next, choose who to sort.</a>
          <a href="" class="button red bigrounded cancel">Go back to beginning</a>
        </div>
      </div>
      <div id="audienceContainer" class="container inner yellow">
        <h3>2. Pick group of friends to sort:</h3>
        <ul id="audience">
          <div id="audienceInfoContainer"></div>
          <li>Friends who are:
            <ul id="listed">
              <li><input type="radio" name="listed" value="all" >All Friends</li>
              <li><input type="radio" name="listed" value="not" checked>Friends not in any list</li>
            </ul>
          </li>
          <li>Friends who are:
            <ul id="gender">
              <li><input type="radio" name="gender" value="both" checked>Both</li>
              <li><input type="radio" name="gender" value="guys" >Guys</li>
              <li><input type="radio" name="gender" value="girls" >Girls</li>
            </ul>
          </li>
        </ul>
        <div class="marginal">
          <a href="" id="doneAudienceButton" class="button green">Done! Start ListHacking!</a>
          <a href="" class="button red bigrounded cancel">Go back to beginning</a>
          </div>
      </div>
      <div id="friendContainer" class="container inner yellow">
        <div id="sortingInstructionContainer"></div>
        <div id="sortingInfoContainer"></div>
        <div id="sortedInfoContainer"></div>
        <div id="profilePictureContainer">
          <img src="">
        </div>
        <div id="profileNameContainer">
          Loading...
        </div>
        <div id="sortButtonContainer"></div>
        <div id="otherButtonContainer">
          <!-- <a href="" id="addNewFriendListWhileButton" class="button rosy">Add a new Friendlist</a> -->
        </div>
      </div>
    </div>
  </body>
</html>
