// oj.tableOfContents.js

;(function(root, factory){

  // Export to Node
  if (typeof module === 'object' && module.exports)
    module.exports = factory(root)

  // Export to RequireJS
  else if (typeof define === 'function' && define.amd)
    define(function(){return factory(root)})

  // Export to OJ
  else
    factory(root, root.oj)

}(this, function(root, oj){

  // Create plugin
  var plugin = function(oj, settings){

    // Determine what digit the header is defined with
    function headerDigit(str){
      if(!oj.isString(str))
        return null;
      var m = str.match(/h(\d)/)
      return (oj.isArray(m) && m.length == 2) ? m[1] : null
    }

    // Convert header items with anchor items that point to them
    function anchorFromHeader(header){
      // Remove the header name
      header.shift()

      var anchor = ['a'], u = oj.unionArguments(header)

      // Remove id as having two on the page could be bad
      // Have href point to it
      if(oj.isDefined(u.options.id)) {
        if(!oj.isDefined(u.options.href))
          u.options.href = "#" + u.options.id
        delete u.options.id
      }

      if(Object.keys(u.options).length > 0)
        anchor.push(u.options)

      anchor = anchor.concat(u.args)
      return anchor
    }

    // tocFromContents: Convert contents ojml to toc ojml
    // [
    //   [h1, 'header', {id:"id-h"}]
    //   [h2, 'subheader', {id:"id-sh"}]
    //   [h2, 'subheader2', {id:"id-sh2"}]
    // ]
    // Becomes:
    // [
    //   [ul
    //     [li, [a, 'header', {href:'#id-h'}] ]
    //     [ul
    //       [li,[a, 'subheader', {href:'#id-sh'}]]
    //       [li,[a, 'subheader2', {href:'#id-sh2'}]]
    //     ]
    //   ]
    // ]

    function tocFromContents(ojFn){
      // Convert fn to ojml
      var i,
      uls = [],
      depth = 1,
      ojml = oj.isFunction(ojFn) ? oj(ojFn) : ojFn,

      // Create initial 'ul' and a current reference to it
      out = ['ul'],
      cur = out

      uls.push(cur)

      for (i = 0; i < ojml.length; i++) {
        var item = ojml[i]

        // Ignore items that aren't non-empty arrays
        if(!oj.isArray(item) || item.length == 0 )
          continue

        // Convert "h1" to 1
        var digit = headerDigit(item[0])

        // No digit, this isn't
        if(!digit)
          continue

        // Depth increase
        if(digit > depth) {
          // Push a new list on the stack to insert to
          var next = ['ul']
          cur.push(next)
          uls.push(cur)
          cur = next
          depth++

        // Depth decrease
        } else if (digit < depth) {
          // Restore the previous list
          uls.pop()
          cur = uls[uls.length-1]
          depth--
        }

        // Add list item at the current depth
        cur.push(['li', anchorFromHeader(item)])
      }
      return out;
    }

    function tableOfContents(fn){
      if(!oj.isFunction(fn))
        throw new Error('oj.tableOfContents expected function for first argument')
      oj.emit(tocFromContents(fn))
    }

    return {tableOfContents:tableOfContents}
  }

  // Export to OJ
  if (typeof oj != 'undefined')
    oj.use(plugin);

  return plugin
}));