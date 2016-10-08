# mock_proxy_chrome_plugin
A simple chrome plugin to access the mock proxy of the [mock proxy]{https://github.com/mhn17/node-mock-proxy} project for better usability. The mock proxy can be put between two systems. If a request reaches the mock server which is already mocked, then the corresponding mock will be returned. If that is not the case, then the request will be forwarded to the other system and its response will be returned.

The chrome extension is still work in progress, so not every feature might work perfectly.

## Features
1. Create mocks directly from captured requests and their corresponding responses which were captured by the mock proxy.
2. Manage existing mocks (activation/deactivation/edit/delete/response preview).
3. Track the last x mocks which were returned by the mock proxy.
4. Create mock sets to group mocks together.
5. Take a look at the mock proxy logs.
6. Three different possibilites to use the chrome extension:
  - Via the popup reachable with the chrome extension icon beside the chrome search bar.
  - Via the chrome developer toolbar.
  - Via an extra tab which will be opened when the "Open in new Window" button is clicked in the popup.

## How to use
### Installation
1. Clone the repository https://github.com/JulHorn/mock_proxy_chrome_plugin.git .
2. Open the extension management page in chrome via "Settings" -> "Extensions".
3. Check the developer mode checkbox (the extension is not packed yet).
4. Click on the button to load an unpacked extension and load the cloned folder.
5. (Optional) If you want to get rid of the chrome popup which will be displayed sometimes, then you have to pack the extension. Simply press the button beside the button to load the unpacked chrome extension and pack the extension yourself.

### Configuration
1. Go to the option page for the chrome plugin via right click -> Options on the new icon beside the search field.
2. You can manage the endpoints here to which the extension should try to reach a mock proxy instance. If none has been configured, the default endpoint "localhost:8001" will be used. Entering "http://" for an endpoint configuration is not necessary.
