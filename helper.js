// get selector & selector all
const getSelector = (selector, parent = false) => parent ? parent.querySelector(selector) : document.querySelector(selector);
const getSelectorAll = (selector_all, parent = false) => parent ? parent.querySelectorAll(selector_all) : document.querySelectorAll(selector_all);