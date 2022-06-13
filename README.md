# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### How to Run This WebApp

In the project directory:
1. Install dependencies by running `yarn i`
2. Run our WebApp by runing `yarn start`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

# About This APP

This app has 3 sections
 - Home Page which contains user structure with group
 - Roles Page which here you can create any roles with 4 kinds of permissions
 - All Users Page where you can search any user from our users

## How to Add a new User

On Home Page there will be `Add` button on every column which when you click on it there will be a sidebar shown. On the Sidebar there will be two things to choose which is `user` and `group`. You can choose user and fill in the datas of our new User or choose group and fill in the permissions of the new group and name but there can't be empty group so you have to add new user to it.

## How to Add a new Role

On Roles Page you can add new Role by clicking on the `Add` button and there will be permissions to choose for our new role.

## How to Edit our User

On Home Page go to your user by passing through the groups and there will be `Edit` button. You can click on it and edit our user values and press `save` to save it.

## How to Delete our User

You can Delete our user on HomePage and AllUsers page.
  - On HomePage go to the user who you want to delete and there will be Delete Button
  - On AllUsers Page search the user that you want to delete and there will be DeleteIcon on the right side of your user.

# Things To Note

## How Our User Permission Works

Our User Permission works by getting all the permissions from the groups where our user residies in and our role permissiions. Using `OR` function.

## Not very responsive

Recommended for desktop use only. Minimum 500px of width needed.

Made By `Emu` on 13th Of June for Intern Home Assignment @NestAcademy
