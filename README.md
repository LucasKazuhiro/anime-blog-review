# About the project
This project was created with the purpose of practicing programming, as well as sharing my opinions about the anime I watch. In this anime review blog, people can view my latest reviews, which include information about the anime such as release date, number of episodes, genres, and more. Additionally, it's possible to see my favorite anime, voice actors, animation studios, animations, and music (OP, ED, OST).

# Tech Stack
To develop this project, Angular was used for the frontend, Tailwind for styling the pages, and Flask (along with Pandas) to return the data displayed on the screen. No database was used, everything is stored locally in JSON or Markdown files.

<table align="center">
    <tr>
        <th></th>
        <th>
            Frontend
        </th>
        <th>
            Backend
        </th>
    </tr>
    <tr>
        <th>
            Languages
        </th>
        <td>
            <img alt="TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
            <img alt="HTML5" src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white"/>
            <img alt="CSS3" src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white"/>
        </td>
        <td>
            <img alt="Python" src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54"/>
        </td>
    </tr>
     <tr>
        <th>
            Libraries
        </th>
        <td></td>
        <td>
            <img alt="Pandas" src="https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <th>
            Frameworks
        </th>
        <td>
            <img alt="Angular" src="https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white"/>
            <img alt="TailwindCSS" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
        </td>
        <td>
            <img alt="Flask" src="https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <th>
            IDE / Editor
        </th>
        <td>
            <img alt="Visual Studio Code" src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>
        </td>
        <td>
            <img alt="PyCharm" src="https://img.shields.io/badge/pycharm-143?style=for-the-badge&logo=pycharm&logoColor=black&color=black&labelColor=green"/>
        </td>
    </tr>
</table>

# Requirements
1. Install [`Node.js`](https://nodejs.org/en) and ensure it includes the `npm` package manager.
2. Install the [`Angular CLI`](https://angular.dev/installation#install-angular-cli) globally.
3. Install [`Python`](https://www.python.org/downloads/) and ensure it inclues the `pip` package manager.

# How to run locally
1. Run a `git clone` of the repository:
```
git clone https://github.com/LucasKazuhiro/anime-blog-review.git
```
2. Open the `back-flask` folder and initialize a [`virtual environment`](https://flask.palletsprojects.com/en/stable/installation/#create-an-environment) [OPTIONAL]
3. Install the dependencies listed in `requirements.txt`:
```
pip install -r requirements.txt
```
4. Open the `front-angular` folder and install the dependencies:
```
npm install
```
5. Go back to the `back-flask` folder and run:
```
flask run
```
6. Go back to the `front-angular` folder and run:
```
ng serve
```
7. Access `localhost` to open the website:
```
http://localhost:4200
```

<br>

# References
This website was inspired by the [`heykperks.moe`](https://heykperks.moe/) project created by [`heyKPerks`](https://github.com/heyKPerks). The source code can be found on [`MyAnimeProfile`](https://github.com/heyKPerks/MyAnimeProfile) repository.
