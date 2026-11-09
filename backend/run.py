from app import create_app

app = create_app()

if __name__ == '__main__':
    print("Starting University Lost & Found Portal Backend...")
    print("Backend running at: http://127.0.0.1:5000")
    app.run(debug=True, host='127.0.0.1', port=5000)
