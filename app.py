from flask import Flask, render_template, request,jsonify
import pandas as pd
import random
import calendar


app = Flask(__name__)

df = pd.read_excel('./Option1_Excel/Avengers_vs_Invaders_Challenge.xlsx', sheet_name='Task1')

# Fetch unique values for dropdowns
unique_countries = df['Country_Code'].unique()
invader_species = df['Invader_Species'].unique()
unique_roles = df['Role'].unique()
superheroes = [x.split('@')[0] for x in list(df['Email'].unique())]

## Function to generate random data
def generate_random_data():

    month_names = [calendar.month_name[i] for i in range(1, 13)]
    monthly_data = [(month_names[i % 12], random.randint(1, 100)) for i in range(10)]
    return monthly_data

## Home page
@app.route('/')
def index():
    return render_template('query_page.html', countries=unique_countries, invader_species=invader_species, roles=unique_roles, emails=[], start=True)


## Dashboard page
@app.route('/dashboard', methods=['POST','GET'])
def dashboard():
    return render_template('dashboard.html',superheroes=superheroes)


## API to get superhero data
@app.route('/superhero/<superhero_name>', methods=['POST','GET'])
def superhero(superhero_name):
    superhero = pd.read_excel('./Option1_Excel/Avengers_vs_Invaders_Challenge.xlsx', sheet_name=f'Task2_{superhero_name}',header=None)
    json_data = superhero.to_json(orient='records')
    return json_data


## API to get email for filtered data
@app.route('/query', methods=['POST'])
def query():
    country = request.form.get('country')
    species = request.form.get('invader_species')
    role = request.form.get('role')
    

    filtered_data = df.copy()
    
    if country:
        filtered_data = filtered_data[filtered_data['Country_Code'] == country]
    if species:
        filtered_data = filtered_data[filtered_data['Invader_Species'] == species]
    if role:
        filtered_data = filtered_data[filtered_data['Role'] == role]

    emails = filtered_data['Email'].tolist()

    return render_template('query_page.html', countries=unique_countries, invader_species=invader_species, roles=unique_roles, emails=emails)


## API to get random data
@app.route('/random_data/<invader_type>', methods=['GET'])
def random_data(invader_type):

    monthly_data = generate_random_data()
    
    data = []
    
    for month_data in monthly_data:
        month_name, kills = month_data
        month_data = {
            "month": month_name,
            "kills": kills
        }
        data.append(month_data)
    
    return jsonify(data)



if __name__ == '__main__':
    app.run(debug=True)