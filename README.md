## Setup

The easiest way to get this project working quickly is to begin by cloning node-dev-bootstrap from Semmy's repository. You'll need
to install Vagrant to get the repo to work. There are more instructions in the README for that repo.

    git clone https://github.com/semmypurewal/node-dev-bootstrap.git politics

This will clone it to a directory called politics. Next, enter that directory.

     cd politics

Delete the example app repository.

    rm -rf app

Next, clone this repository into the directory as the app.

      git clone https://github.com/nina-lab/Political-Love-Hate-Project.git app

The next step is to get a copy of our credentials.js file or set up your own. You can find e-mail Semmy for a copy of that, or read
his blog post ( http://blog.semmy.me/post/17390049513/streaming-twitter-with-ntwitter-and-node-js ) for more information.

Now, we can startup Vagrant (assuming we have installed our base box as described in the node-dev-bootstrap instructions) and run the app.

     vagrant up
     vagrant ssh
     cd app
     node app.js

Give it a second to populate the data, and then point your browser to localhost:3000.

## Development

If you want to make a change, please fork this repository to your local directory, commit your changes there, and then issue a pull request!
     


