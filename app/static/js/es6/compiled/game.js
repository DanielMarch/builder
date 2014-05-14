(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#seed').click(seed);
    $('#getforest').click(getForest);
    $('#forest').on('click', '.tree.alive.not', grow);
    $('#convert').click(convert);
  }
  function convert(e) {
    var data = $('#numbers').val();
    var userId = $('#username').attr('data-id');
    console.log(data);
    console.log(userId);
    $.ajax({
      url: '/convert',
      type: 'POST',
      data: {
        data: data,
        userId: userId
      },
      success: (function(user) {
        console.log(user);
        $('#money').empty().append(user.cash);
      })
    });
    e.preventDefault();
  }
  function grow() {
    var tree = $(this);
    var treeId = $(this).data('id');
    $.ajax({
      url: ("/tree/" + treeId + "/grow"),
      type: 'PUT',
      dataType: 'html',
      success: (function(t) {
        tree.replaceWith(t);
        $('.chop').click(chop);
      })
    });
  }
  function chop(e) {
    var tree = $(this).parent();
    var treeId = $(this).parent().data('id');
    $.ajax({
      url: ("/chop/" + treeId + "/chop"),
      type: 'PUT',
      dataType: 'html',
      success: (function(t) {
        tree.replaceWith(t);
      })
    });
    e.stopPropagation();
  }
  function getForest() {
    var userId = $('#username').data('id');
    $.ajax({
      url: ("/forest/" + userId),
      type: 'GET',
      dataType: 'html',
      success: (function(trees) {
        $('#forest').empty().append(trees);
      })
    });
  }
  function seed() {
    var userId = $('#username').data('id');
    $.ajax({
      url: '/seed',
      type: 'POST',
      dataType: 'html',
      data: {userId: userId},
      success: (function(tree) {
        $('#forest').append(tree);
      })
    });
  }
  function login(e) {
    var data = $(this).closest('form').serialize();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: (function(r) {
        console.log(r);
        $('#login').prev().val('');
        $('#username').attr('data-id', r._id);
        $('#username').text(r.username);
        $('#wood').empty().append(r.wood);
        $('#money').empty().append(r.cash);
      })
    });
    e.preventDefault();
  }
})();

//# sourceMappingURL=game.map
