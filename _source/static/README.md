Running `node . static` will generate a complete static site based on the files 
in `patternlab-node/source/_patterns/04-pages`. The site will be viewable at
[http://localhost:3000/static/](http://localhost:3000/static/). An `index.html` will be generated based on the 
`00-homepage.mustache` file. If the links are relative and they work correctly in 
the Pattern Lab UI, they will work correctly in the static site even if the 
`static` directory is moved and renamed. The only caveat is that links to other 
pages in the `patterns` directory must start with `../04-pages-` and not 
`../../patterns/04-pages-`.
