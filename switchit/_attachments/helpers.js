chunk = function(a, s) {
  var i, _i, _ref, _results;
  if (a.length === 0) {
    return [];
  } else {
    _results = [];
    for (i = _i = 0, _ref = a.length - 1; s > 0 ? _i <= _ref : _i >= _ref; i = _i += s) {
      _results.push(a.slice(i, +(i + s - 1) + 1 || 9e9));
    }
    return _results;
  }
};