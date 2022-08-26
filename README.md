# Ar-Business-Card

This application uses zappars image-tracking to track a business card and renders an interactive 3d scene on top of it.

## Prerequisites

To get started you'll want to ensure you have:

- installed Node.js version 10 or later
- printed out the example target image, `Business-Card.png`

## Running the Project

Once you have cloned this repository, open a terminal in the root directory of this project and follow these steps to get started.
​
Install the dependencies by running:

```bash
npm install
```

​
Next, run the project using the following command:
​

```bash
npm start
```

The `webpack server` tool will host the content locally and give you an address you can open in the browser of your local machine.
​
For the best experience, launch this project on a mobile device by following these steps:

1. Ensure the device is on the same local network (e.g. Wifi)
2. Find out the IP address of your computer
3. On your mobile device, visit: `https://YOUR-IP-ADDRESS:PORT` replacing both `YOUR-IP-ADDRESS` and `PORT` (the port is the number after the `:` in the address given by `webpack-dev-server`). Note it's important to type `https` at the start of the address to ensure your device connects over HTTP**S**.

## Target Image

![Target Image](src\assets\Business-Card.png)

## Technologies

- [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/)
- [Webpack](https://webpack.js.org/)
