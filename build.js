'use strict';

import Metalsmith                         from 'metalsmith';
import markdown                           from 'metalsmith-markdown';
import layouts                            from 'metalsmith-layouts';
import serve                              from 'metalsmith-browser-sync';
import moment                             from 'moment';
import branch                             from 'metalsmith-branch';
import excerpts                           from 'metalsmith-excerpts';
import collections                        from 'metalsmith-collections';
import permalinks                         from 'metalsmith-permalinks';
import assets                             from 'metalsmith-assets';
import {site, source as src, dest, posts} from './config';

var app = Metalsmith(__dirname);

// Define our sitewide vars
app.metadata({
  site: site
});
app.source(src);
app.destination(dest);

app.use(markdown());
app.use(excerpts());
app.use(collections({
  posts: {
    pattern  : 'posts/*.md',
    sortBy   : 'modifyDate',
    reverse  : true,
    metadata : {posts: posts}
  }
}));

// Show post branch
var postRoute = branch('posts/*.html');
postRoute.use(permalinks({
  pattern: 'post/:tile',
  relative: false
}));
// Show all posts branch
var catchAllRoute = branch('!posts/*.html');
catchAllRoute.use(permalinks({
  relative: false
}));

app.use(postRoute);
app.use(catchAllRoute);

app.use(layouts({
  engine: 'jade',
  directory: 'templates/layouts',
  default: 'default.jade',
  moment: moment
}));

app.use(assets({
  source: './public',
  destination: './public'
}));

app.use(serve({
  port   : 8099,
  server : dest,
  files  : ["src/**/*.md", "templates/**/*.jade"]
}));

app.build(function(err) {
  if (err) {
    throw err;
  } else {
    console.log('Build succeded.');
  }
});
