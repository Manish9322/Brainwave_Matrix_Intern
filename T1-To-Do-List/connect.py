from flask import Flask, request, render_template,redirect
import mysql.connector

app = Flask(__name__)


db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Manish@123',
    'database': 'to_do_list'
}

def get_db_connection():
    conn = mysql.connector.connect(**db_config)
    return conn


@app.route('/')
def index():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM tasks ORDER BY id DESC")
    tasks = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    return render_template('index.html', tasks=tasks)

@app.route('/add_task', methods=['POST'])
def add_task():
    task = request.form['task']  
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("INSERT INTO tasks (task) VALUES (%s)", (task,))
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return redirect('/')


@app.route('/delete_task', methods=['POST'])
def delete_task():
    task_id = request.form['task_id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return redirect('/')


if __name__ == '__main__':
    app.run()
