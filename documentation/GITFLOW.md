# Git FLow

## Git CLI

### Retrieve a remote repository

`git clone <my-url-project>`

```js
Cloning into `<my-url-project>`...
> remote: Counting objects: 10, done.
> remote: Compressing objects: 100% (8/8), done.
> remove: Total 10 (delta 1), reused 10 (delta 1)
> Unpacking objects: 100% (10/10), done.
```

### To know the status of our git tracking

`git status`

> 👇 If you are 'ahead' of the remote branch.

```js
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
(use "git add <file>..." to update what will be committed)
(use "git restore <file>..." to discard changes in working directory)
        modified:   app.js
        modified:   public/stylesheets/style.css
        modified:   routes/drive.js

no changes added to commit (use "git add" and/or "git commit -a")
```

> 👇 If you are up to date.

```js
On branch develop
Your branch is up to date with 'origin/develop'.

nothing to commit, working tree clean
```

### Update from remote repository

`git pull`

> 👇 Here we get 2 new branches and update 10 files.

```js
Unpacking objects: 100% (10/10), done.
From 'https://github.com/Barathon-2i-Tech/Barathon_desktop.git'
 * [new branch] #28-creating_database -> origin/#28-creating_database
 * [new branch] #26-creating_seeders -> origin/#28-creating_seeders
 Already up to date.
```

### Send to remote repository

Before sending your local code 💻 to the remote repository (eg: github)
`git push`

> 👇 Here, we push one branch

```js
Total 0 (delta 0), réutilisés 0 (delta 0), réutilisés du pack 0
remote:
remote: Create a pull request for 'feat/#26-database_seeders' on GitHub by visiting:
remote:      https://github.com/Barathon-2i-Tech/Barathon_desktop/pull/new/feat/%2326-database_seeders
remote:
To github.com:Barathon-2i-Tech/Barathon_desktop.git
 * [new branch]      feat/#26-database_seeders -> feat/#26-database_seeders
La branche 'feat/#26-database_seeders' est paramétrée pour suivre la branche distante 'feat/#26-database_seeders' depuis 'origin'.
```

### List all branches

Local
`git branch`

> 👇 Note that the branch you are on is marked with an \*.

```js
* develop
main
```

Remote
`git branch -r`

> 👇 **origin** is not the name of the remote repository. Instead, it is an alias **local** defined as a key instead of the remote repository URL.
> This saves the user from having to type the entire remote URL when requesting a push.

```js
origin/24431_menu_section
origin/24438_add_authentification
origin/HEAD -> origin/main
origin/develop
origin/main
```

Local + Remote
`git branch -a`

> 👇 Note that remote branches start with **remote**.

```js
* develop
main
remotes/origin/25056_sort_data_json
remotes/origin/HEAD -> origin/main
remotes/origin/develop
remotes/origin/main
```

### Create a new branch

`git checkout -b <my-branch-name>`

> 👇 Note that it is the **-b** option that allows you to create a new branch and automatically move to it when you create it.

```js
Switched to a new branch '<my-branch-name>'
```

### Moving through the branches

Local
`git checkout <my-branch-name>`

> 👇 Note that checkout runs **without** option.

```js
Switched to branch '<my-branch-name>'
```

### Delete a branch

Local
`git checkout <my-branch-name>`

> 👇 Note that checkout is executed with the **-d** option.

```js
Deleted branch <my-branch-name> (was f187012).
```

Remote
`git push origin --delete <my-branch-name>`

> ☝️ **ONLY** in case you push a branch that you didn't want to send to the remote repository!
