# dockerx
Use Docker environments to configure and run command-line tools.

## Configuration

TODO

## Example

### Setup

First, setup the DockerX command-line tool.  For this demo, we will assume that you've already cloned this repository, and plan to link it globally for development purposes.

```
> cd /path/to/repo
> npm link
```

Next, create the following configuration file.  This lets DockerX know which commands you want to support, and how to properly configure the Docker environment for each command.

```
# ~/.dockerx/config.yml

commands:
  node:
    image: 'node:latest'
    command: '/usr/local/bin/node'
```

Finally, run the following command:

```
> dockerx node
```

If you do not already have the image installed on your machine, it will take a short while to download and extract the image.  Once this step has completed, you will be connected to the Node.js REPL in a new container.

You can also use a Bash alias to simplify this command:

```
> alias node='dockerx node'
> node  # Runs the Node.js REPL
```


A few things to note:

* The directory where you ran the `dockerx` command (`$PWD`) is automatically mounted to `/code/<folder-name>`, so you can access these files as needed.
* The working directory has been set to the location above.
* When you exit the Docker environment, the container will automatically be cleaned up for you.
  * This uses the `--rm` flag from the Docker CLI.  For more information, please refer to the Docker documentation.