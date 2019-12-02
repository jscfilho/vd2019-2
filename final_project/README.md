# Projeto Final de VD - 2019

Link direto: https://jscfilho.github.io/vd2019-2/final_project/index.html

Link para notebook: https://observablehq.com/@jscfilho/projeto-final-de-vd-2019@585

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
python -m SimpleHTTPServer
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@4
npm install https://api.observablehq.com/d/6f25c80bb75bd44d.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "@jscfilho/projeto-final-de-vd-2019";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~
