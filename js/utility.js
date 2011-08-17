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

function getByID(arr, id){
  $(arr).each(function(i,m){
    if (m.id == id) return m;
  });
  return null;
}

function intersectionByID(a1, a2){
  var newArray = [];
  $(a1).each(function(i,m){
    // for each m of a1, see if n of a2 such that m.id == n.id exist
    if($.grep(a2, function (n) { return n.id == m.id; }).length){
      // if yes, check if m exist in newArray so we don't give duplecates
      if($.grep(newArray, function (b) { return b.id == m.id; }).length){
        // already in the list
      }else{
        newArray.push(m);
      }
    }
  });
  return newArray;
}

function differenceByID(a1, a2){
  var newArray = []
  $(a1).each(function(i,m){
    // for each m of a1, see if n of a2 such that m.id == n.id exist
    if($.grep(a2, function (n) { return n.id == m.id; }).length){
      //shouldn't
    }else{
      newArray.push(m);
    }
  });
  return newArray;
}