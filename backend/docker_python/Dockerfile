FROM python:3.9-slim

RUN apt-get update -y
RUN apt-get install -y libseccomp-dev
RUN apt-get install -y strace

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

ENV FLASK_APP=api.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]



# docker build -t flask-api .
# docker run -p 5000:5000 flask-api