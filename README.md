# tarpit
> tarpit actions based on a key

[![Build Status](https://travis-ci.org/npm/tarpit.svg?branch=master)](https://travis-ci.org/npm/tarpit)

![artax](artax.gif)

`tarpit` is a package that allows you to exponentially stall responses based on the frequency of a keyed
request. for example, if a specific IP requests an endpoint too frequently, you can use tarpit to
stall the handler sending a response back, until the rate of request is reduced.

## installation

```
npm install tarpit --save
```

## usage

see this [example](example.js).

`tarpit` uses [redis](https://redis.io/). you'll need to have a redis-server running for `tarpit` to work.
