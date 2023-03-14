# Barathon Administration

<div align="center">

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Barathon-2i-Tech_Barathon_Admin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Barathon-2i-Tech_Barathon_Admin) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Barathon-2i-Tech_Barathon_Admin&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Barathon-2i-Tech_Barathon_Admin) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Barathon-2i-Tech_Barathon_Admin&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Barathon-2i-Tech_Barathon_Admin) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Barathon-2i-Tech_Barathon_Admin&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Barathon-2i-Tech_Barathon_Admin) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Barathon-2i-Tech_Barathon_Admin&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Barathon-2i-Tech_Barathon_Admin)

</div>

## Prerequisites

You need Visual Studio Code and Docker installed.

## .env

You need copy first the .env.example file by renaming it to .env and complete the following fields:

- VITE_API_URL

```bash
cp .env.example .env
```

## Start Docker

Run the Docker Desktop application to start Docker. You will know it's running if you look in the activity tray and see the Docker whale icon.
Docker might take a few minutes to start. If the whale icon is animated, it is probably still in the process of starting. You can click on the icon to see the status.

<div align="center">
<IMG  src="https://code.visualstudio.com/assets/docs/devcontainers/tutorial/docker-status.png"  alt="Docker status"/>
</div>

## Check Docker

Once Docker is running, you can confirm that everything is working by opening a new terminal window and typing the command:

```bash
docker --version
# Docker version 18.09.2, build 6247962
```

## Install the extension

The Dev Containers extension lets you run Visual Studio Code inside a Docker container.

<div align="center">
<IMG  src="https://code.visualstudio.com/assets/docs/devcontainers/tutorial/dev-containers-extension.png"  alt="Dev Containers extension" width=600px />
</div>

When the Dev Containers extension is installed, you will see a new Status bar item at the far left.

<div align="center">
<IMG  src="https://code.visualstudio.com/assets/docs/devcontainers/tutorial/remote-status-bar.png"  alt="Remote Status bar item"/>
</div>

## Open the application into the devcontainer

Click on the status bar and choose "Reopen in container".

<div align="center">

![reopenInContainer.png](./documentation/readme_image/reopenInContainer.png)

</div>

Visual Studio will reload and you will see Dev Container written next to the status bar.

<div align="center">

![applicationLaunched.png](./documentation/readme_image/applicationLaunched.png)

</div>

The application is now launched in a container. Just type "**_npm run dev_**" in the terminal
