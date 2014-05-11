oj.tableOfContents
===========

A table of contents creation plugin for OJ to clearly seperate content from document structure like headers.

### Use Plugin:

    oj.use(require('oj-table-of-contents'));

### Usage

    // Create functions to define your content (OJ is powerful)
    // Assume a `content` function that wraps what is content in your document
    function aboutPage(content, h1, h2) {
      h1('Who are we')
      content(function(){
        p('We are the people who believe in what we believe in.')
      })
    }

    // oj.contents will output all the content
    oj.contents(aboutPage)

    // oj.tableOfContents will output everything EXCEPT the content
    oj.tableOfContents(aboutPage)

You can override what tags tableOfContent uses

    oj.tableOfContents({h1:div, h2:div}, aboutPage)




