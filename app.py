from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/location', methods=['POST'])
def get_location():
    try:
        data = request.json
        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if not latitude or not longitude:
            return jsonify({"error": "请提供纬度和经度"}), 400

        # 使用 OpenStreetMap Nominatim API 解析地址
        osm_url = f"https://nominatim.openstreetmap.org/reverse?lat={latitude}&lon={longitude}&format=json"
        headers = {
            "User-Agent": "MyApp/1.0"
        }
        response = requests.get(osm_url, headers=headers)

        # 输出返回的原始内容进行调试
        print(f"OpenStreetMap API 返回原始内容: {response.text}")

        # 检查响应状态
        if response.status_code != 200:
            return jsonify({"error": "无法从OpenStreetMap API获取数据"}), 500

        # 解析 JSON 响应
        response_data = response.json()

        # 提取详细地址信息
        display_name = response_data.get("display_name", "无法获取地址")
        address = response_data.get("address", {})
        
        # 打印更多的地理位置细节
        print(f"地址详情: {address}")
        print(f"解析的地址: {display_name}")

        return jsonify({
            "address": display_name,
            "address_details": address
        })

    except Exception as e:
        print(f"获取位置失败: {str(e)}")
        return jsonify({"error": f"获取位置失败: {str(e)}"}), 500


if __name__ == '__main__':
    app.run(debug=True)