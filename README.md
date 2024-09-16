## FRIDGEDOOR README

## Git Workflow

_Workflow_:

Create new branch -> do changes -> commit changes -> rebase and push changes -> create pull request add code/documentation responsible members as reviewers
-> when pull request is merged delete your branch -> sync fork -> go to your main -> do git pull before doing any local work! 

```bash
git checkout -b myNewbranch
git commit -m "Fist commit!" -m "this is my first commit using the very best git tutorial"
git add pathTo/firstFile
git commit -m "small fix first file"
git add pathTo/firstFile pathTo/secondFile
git commit -m "small fix to multiple files" -m "moved change from file1 to file2"
git rebase -interactive commitHashToFirstCommit
```
```
pick d94e78 Fist commit!
s 4e9baa small fix first file
s af2581 small fix to multiple files

```
```
git commit -m "Added new files and changes" -m "Added 2 new files and added changes from both, implemented a new feature etc..." (you need to commit your rebase)
git checkout myNewBranch
git pull --rebase upstream main
```
--> here you do a compiletest
```
git push origin myNewBranch
```
Now you go to github and it will ask if you want to do a Pull Request
If PR has merge conflicts fix those!
Write a good detailed message in the pull request - add code/documentation responsible members as reviewers
Wait for it to be merged
```
git branch -d myNewBranch
git checkout main
git pull
```
Now you are ready to implement new changes


_Get started:_

- Setup Github with SSH key
- Fork main repo
- Create local directory on your machine 
    mkdir yourproject
    cd/chdir yourproject
- Set your credentials on your machine:
    git config user.name "YOUR_NAME"
    git config user.email GITHUB_USERNAME@users.noreply.github.com
- Copy SSH link from online repository
- in your projectdirectory do:
```
git clone git@github.com:ORG/PROJECTNAME.git / code -> copy ssh
git remote rename origin upstream
git remote add origin git@github.com:YOURUSERNAME/PROJECTNAME.git

```


-----------------------------
_Git tutorial:_
When working on a new feature - create a new branch -> Never work in your main branch
```
git checkout -b myNewfeature
```

Too see which branch your'e on and/or if you have uncommited changes do:
```
git status
```
After every little change you do:
```
git add dir/changedFile (path)
git commit -m "Short title where you specify which part you worked on" -m "more detailed explanation if required"
```
_Example_: 
```
git commit -m "Added canbus interface to src/" -m "technical description of implementation"
```

You can never commit too much! Many commits make it easier to revert if you do something you didn't mean to
And remember: ONE CHANGE per commit otherwise writing commit messages will be hard and you will get lost and forget changes!!!

You can create new branches from commits if you want to do experimental changes 
```
git checkout -b commitHash
```

Too see commits you've done on a certain branch do
```
git log
```

If you have many small commits do:
```
git rebase -interactive commitJustBeforeTheFirstOneThatYouWantToSquash
```

The command line editor, like nano or vim, will open to show you the commits again, now with the older commit on top. Before each commit, the word pick will be shown. Delete the word pick, and write the word squash or just the letter s instead, with the exception of the first entry; this commit is the oldest one, so all future commits will be squashed into it. 

```
pick d94e78 Prepare the module for feature B
s 4e9baa Good implementation
s af2581 Fix this and that
s 643d0e Code cleanup
s 87871a I'm almost ready!
s 1c3317 Whoops, it is not ready yet...
s 871adb OK, feature B is fully implemented
```

_Pushing your changes:_

When working on your changes someone else might push their changes first therefore you need to do
```    
git checkout myNewBranch
git pull --rebase upstream main
git push origin myNewBranch
```
```
      .-----A origin/myNewBranch
     / 
-----o-----------Z grupp20 upstream/main
```
```
                 .-----A' origin/myNewBranch
                 /
-----o-----------Z grupp20 upstream/main
```

When pushing to your forked repo - remember to do a compilation test first

