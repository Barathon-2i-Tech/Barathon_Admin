# Little reminder why it's important

## 1. Better Communication

Building a product is always a **Team Effort** which requires making sure that everyone understands the **names** that we name, we got to name them clearly.

## 2. Easy Reviewing

Consistent code conventions makes reviewing things easier as we don’t have to find out what something means.

## 3. Easy On-boarding

For onboarding new developers, coding conventions allow them to easily grasp the meaning just by looking at the code.

# How to write meaningful names?

👉 **Use intention revealing names**
Variable name must define the exact explanation of its content so it can document itself in case of no documentation.

<pre>
❌ var d // elapsed time in days


✔️ var elapsedTimeInDays

</pre>

👉 **Use pronounceable names**

<pre>
❌ class NwClmDmg { private _lyt = 'dashboard'; private Date _modymdhms;}


✔️ class NewClaimDamage { private _layout = 'dashboard'; private Date _modificationTimestamp;}
</pre>

👉 **Use searchable names**

If a variable or constant might be seen or used in multiple places in a body of code, it is imperative to give it a search-friendly name.

<pre>
❌ for (int item = 0; item < 34; item++) { s += (t[item] * 4) / 5;}

✔️  var realDaysPerIdealDay = 4;
    const WORK_DAYS_PER_WEEK = 5;
    var sum = 0;

   for (var item = 0; item < NUMBER_OF_TASKS; item++) {
         var realTaskDays = taskEstimate[item] * realDaysPerIdealDay;
         var realTaskWeeks = (realTaskDays / WORK_DAYS_PER_WEEK);
         sum += realTaskWeeks;
    }

</pre>

👉 **Use one consistent language**

Decide and use one natural language for naming, e.g. using mixed English and French names will be inconsistent and unreadable.

👉 **There’s no limit to the length of the variable name**

Use short enough and long enough variable names in each scope of code.

:information_source: **Conventions commonly used in code:**

**Snakecase:**

Words are delimited by an underscore.

<pre>first_name</pre>

## **Pascalcase:**

Words are delimited by capital letters.

<pre>FirstName</pre>

## **Camelcase:**

Words are delimited by capital letters, except the initial word.

<pre>firstName
</pre>

# **Naming Conventions**

Consistency and readability are key ideas that should be utilized in the naming of variables. Regardless of how you choose to name your variables, always ensure that your naming conventions are consistent throughout the code. Consistency allows others to more easily understand your code.

👉 **Better Variables**

Most often variables are declared with \***\*camelCase\*\***.

<pre>
var firstName = 'John';
</pre>

👉 **Better Constants**

Constants intended to be non-changing variables are declared in \***\*ALL CAPS\*\***.

<pre>
var SECONDS = 60;
</pre>

👉 **Better Booleans**

A prefix like `is` , `are` , `has` helps developer to distinguish a boolean from another variable by just looking at it.

<pre>
var isVisible = true;
var hasKey = false;
</pre>

👉 **Better Functions**

Functions names are written in \***\*camelCase\*\***. Always start your function name with a \***\*”Verb”\*\*** which defines what that function is trying to do in conjunction with the name of the \***\*”Entity”\*\*** being affected by this function.

<pre>
getOrder()
fetchClaims()
deleteOrder()
connectToDatabase()
</pre>

👉 **Better Methods**

Like functions, methods names are written in \***\*camelCase\*\***. As class name itself depict “Entity” thus suffixing the “Entity” in a function name doesn’t make sense because it becomes self-explanatory in case of class methods.

<pre>
class User {
     delete(id) {
          // do something
    }
 }
var user = new User();

console.log(user.delete(2)); // delete the user with ID = 2
</pre>

👉 **Better Classes**

A class should be declared with \***\*PascalCase\*\*** in its own file.

<pre>
class User {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
}

var user = new User(‘John’, ‘Doe’);
</pre>

👉 **Better Components**

Components are widely declared with \***\*PascalCase\*\*** too. When a component gets used, it distinguishes itself from native HTML and web components, because its first letter is always written in uppercase.

```
function UserProfile(user) {
     return (
        <div>
            <span>First Name: {user.firstName}</span>
            <span>Last Name: {user.lastName}</span>
        </div>
     );
}

<div>
     <UserProfile user={{ firstName: ‘John’, lastName: ‘Doe’ }}
     />
</div>
```

👉 **Better Arguments**

Use self-explanatory argument label that indicates more expressively the intent of the argument.

<pre>
❌ function getRemainder(x, y) {}

✔️ function getRemainder(number, divisor) {}
</pre>

**Parentheses Style**

Two commonly used conventions for parenthesis are: **K&R Style Parentheses** and **Allman Parentheses.**

It is recommended to use **K&R Style parentheses** because they save one line and seem natural.

👉 **K&R Style Parentheses**

<pre>
if(isVisible) {
    // do something
}
</pre>

👉 **Allman Parentheses**

<pre>
if(isVisible)
{
    // do something
}
</pre>
