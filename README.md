# TypeError - The header content contains invalid characters

If you are reading this, chances are you have experiences and error that looked like something like this:

```
_http_outgoing.js:351
      throw new TypeError('The header content contains invalid characters');
      ^

TypeError: The header content contains invalid characters
    at ServerResponse.OutgoingMessage.setHeader (_http_outgoing.js:351:13)
```

To make things worse, this error might have showed up randomly, on the code that used to work before.

The error was *"introduced"* by an upgrade to Node.js version [4.3.0](https://github.com/nodejs/node/commit/58db386a1be17499a444df6a78743c9dfb3cf) or later via [this commit](https://github.com/nodejs/node/commit/7bef1b790727430cb82bf8be80cfe058480de100).

## Why

The update was done for security reasons and to better comply with http spec. You can read more about the underlying security issues [in the commit itself](https://github.com/nodejs/node/commit/58db386a1be17499a444df6a78743c9dfb3cf). 

You can read more about the actual spec in this [Stack Overflow Question](http://stackoverflow.com/questions/19028068/illegal-characters-in-http-headers), which also provides relevant links to the actual HTTP 1.1 spec ([section 2.2](http://www.w3.org/Protocols/rfc2616/rfc2616-sec2.html#sec2.2) and [section 4.2](http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2)).

TLDR; version is as follows:

1. Each header looks something like this: `Accept-Encoding: gzip,deflate`
2. `Accept-Encoding` - is the header **name**
3. `gzip,deflate` - is the header **value**
4. Only some characters are allowed in the header value (mostly English ASCII)
5. Even less characters are allows in the header key

An unwanted consequence of this update is that a lot of various node projects (that did not follow the spec, but that used to work just fine) all of the sudden broke.

## What to do about it

There could be 2 reasons for you to see this error: 

1. One of your project's dependencies was sending headers that did not comply with the spec
2. Your own code did not comply with the spec

### Case 1

If one of the project's dependencies did not comply with the spec, chances are they already have a fix in place.

Simply update to the latest version, and it should solve the problem.

If the dependency does not have a fix yet, all you can do is file an issue and hope that they can resolve it soon.

### Case 2

If you own code did not follow the spec, you'll have to look at your specific implementation.

In many cases the issue can be remedied short term, by removing invalid characters from your headers.

**This is the purpose of this repo.** 

If you look at the [rules.js](https://github.com/akras14/validate-http-header/blob/master/rules.js) file you will see that it exports 4 functions:

- For header name
    - **validHeaderName** - Returns true is header name is valid
    - **cleanHeaderName** - Takes a header name, and returns a valid header name, removing unwanted characters
- For header value
    - **validHeaderValue** - Returns true i header value is valid
    - **cleanHeaderValue** - Takes a header value, and returns a valid header value, removing unwanted characters

The **validate** functions were copy/pasted from [the node source](https://github.com/nodejs/node/blob/master/lib/_http_common.js).

These functions will need to be updated as the Node implementation changes.

The **clean** functions used the same logic as the **validate**, but they actually go through and remove unwanted characters.

It may be helpful to look at the [test file](https://github.com/akras14/validate-http-header/blob/master/test/rules.test.js) too see some examples of valid and invalid headers.

## Hooking it into your code

In [index.js](https://github.com/akras14/validate-http-header/blob/master/rules.js) you can see a sample implementation of how you might want to hook that into your own code.

It's a module that exports only one function called **cleanHeaders**, which accepts http headers represented as a JavaScript object, and goes through every header key and value, removing unwanted characters.

Check out this [test file](https://github.com/akras14/validate-http-header/blob/master/test/index.test.js) to see how it works.

You may notice that it does two passes through, once simply checking if header is valid, and one more time to remove unwanted characters. I personally prefer that approach because I didn't want to mess with headers that did not need to be messed with. But you can just run it through the cleanHeaderName and cleanHeaderValue right away, to gain faster performance.
