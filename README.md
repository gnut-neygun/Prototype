### Dependencies

Python (>=3.8)

Nodejs (Javascript runtime)

Yarn (Javascript package manager)

### Build

#### Frontend

For the first time run:

`yarn install` to install dependencies

Build and start development server with hot reload:

`yarn dev`

Building a static production bundle:

`yarn build`

Serving in production:

`yarn serve`

(See package.json file for more details. We use Vite as the build system).

***Disclaimer: Backend should be up and running first so that the app works properly.

#### Backend

Setup python virtual environment (If run for the first time, so that pip install doesn't pollute your local environment
setup), cd to backend folder and run:

`python3 -m venv env`

Activite the python virtual environment:

`source env/bin/activate`

Then install python dependencies:

`pip install -r requirements.txt`

After that just run the flask_entrypoint.py file. It will start an HTTP server for backend.

#### Evaluation logs.

The logs are located in backend/data . I have to modify the logs a bit so that it conforms to the format and Pm4py is
able to parse.