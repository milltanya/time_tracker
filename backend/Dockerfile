FROM python:3.8
ENV PYTHONUNBUFFERED=1
RUN mkdir /time_tracker
WORKDIR /time_tracker
COPY requirements.txt /time_tracker/
RUN pip install --upgrade pip && pip install -r requirements.txt
