Fepper can just as easily work with a CMS backend such as WordPress or Drupal, 
while not requiring Apache, MySQL, or PHP. Put the actual backend codebase or 
even just a symbolic link to the codebase into the `backend` directory. Then, 
enter the relative paths to the appropriate backend directories into conf.yml. 
(Do not include `backend` or a leading slash.) You will then be able to run 
`node . frontend-copy` or `node . syncback` to export your frontend data into 
your backend web application.
