# Project Documentation

## Overview

This project includes two main components:

1. **Task 1 Bonus**: Implemented in `SavingThePlanet.ipynb`
2. **Task 2 Bonus**: Implemented in `app.py`, along with the `static` and `templates` folders.

The web application is built using Flask and provides a dashboard to view and interact with data related to superheroes and invaders. The data is managed using pandas and sourced from an Excel file.

## Prerequisites

Ensure you have the following installed on your system:

- Python 3.x
- Flask
- pandas
- openpyxl (for reading Excel files)
- calendar (standard Python library)

## Running the Flask App

1. **Run the Flask application**:
   ```sh
   python app.py
   ```

2. **Open your browser and navigate to**:
   ```
   http://127.0.0.1:5000/
   ```

## Application Pages

1. **Home Page** (`http://127.0.0.1:5000/`):
   - Provides the ability to request emails using specified filters (country, invader species, and role).

2. **Dashboard Page** (`http://127.0.0.1:5000/dashboard`):
   - Displays a dashboard where you can see details of all superheroes.

## Project Structure

```
project/
│
├── app.py
├── templates/
│   ├── dashboard.html
│   └── query_page.html
├── static/
│   ├── css/
│   │   ├── style_dash.css
│   │   └── styles.css  
│   ├── js/
│   │   └── script.js
└── Option1_Excel/
    └── Avengers_vs_Invaders_Challenge.xlsx
```

### Key Files and Directories

- **app.py**: Main application script.
- **templates/**: Contains HTML templates for the web pages.
- **static/**: Contains static files such as CSS and JavaScript.
- **Option1_Excel/**: Directory where the Excel file is stored.

By following this guide, you should be able to set up, run, and interact with the project successfully. If you encounter any issues, ensure that your environment and dependencies are correctly set up and that the Excel file is in the correct directory with the expected format.