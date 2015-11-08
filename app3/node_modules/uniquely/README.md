# Uniquely

Create unique identifiers.

## API

Default characters : `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`

### id

An id based on a number.

```js
var unique = require('uniquely');
unique.id(87654); // 'Lmm'
```

### time

An unique id, from your characters, based on microtime

```js
unique.time(); // '5Pp68s5wk'
```

### random

A random id, from your characters, specified number of characters

```js
unique.random(10); // 'e90WFdthcl'
unique.random(10); // 'XnP2uvVw7r'
```

### iterator

A way to create sequential ids, using es6 iterators

```js
var it = unique.iterator();
it.next().value; // '0'
// some tens of thousands iterations later...
it.next().value; // 'aRG'
```

### create

The above functions, with your own set of characters

```js
var create = unique.create;
var abc = create('abc');

abc.id(87654); // 'cccbcacaaa'
abc.random(10); // 'acbccbcaba'
abc.time(); // 'acacccaabccbacaabaccacbacbbcbbbb'
```
