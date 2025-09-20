socket.on('server_shutdown', (data) => {
    showAndAutoHide('error-div', `Error-Message: ${data.message}, Error-code: XXXX, Thrown by backend`,10000000);
})