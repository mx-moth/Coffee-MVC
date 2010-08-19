/**
 * Loads all the required files, in the required order.
 */

include('./libs/mootools-server-1.3b2');
include('./libs/dom');

var CoreObject = include('./CoreObject');

include('./App');
app = new App();

app.router.connect('/', {controller: 'Pages', action: 'index'});
app.router.connect('/act', {controller: 'Cont', action: 'act'});

response.write(HTML.dump(app.router.getUrl({controller: 'Cont', action: 'act', arguments:[10, 20], parameters: {param: 'test'}})));
response.write(HTML.dump(app.router.getUrl({controller: app.getClass('Cont', 'Controller'), action: 'act', arguments:[10, 20], parameters: {param: 'test'}})));
var action = app.router.getAction(request.get.url);
var controller = new (action.controller)();
controller.params = action.parameters;
response.write(controller.handle(action.action, action.arguments));
