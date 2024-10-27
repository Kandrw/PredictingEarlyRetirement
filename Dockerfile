
FROM python:3.9
LABEL description="PredictingEarlyRetirement"

RUN apt-get -y update
RUN apt-get -y upgrade

RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libbz2-dev \
    libreadline-dev \
    libsqlite3-dev \
    wget \
    curl \
    llvm \
    libxml2-dev \
    libxslt1-dev \
    libffi-dev \
    zlib1g-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
RUN wget https://www.python.org/ftp/python/3.9.6/Python-3.9.6.tgz && \
    tar -xvf Python-3.9.6.tgz && \
    cd Python-3.9.6 && \
    ./configure --enable-optimizations && \
    make -j16 && \
    make altinstall && \
    cd .. && \
    rm -rf Python-3.9.6 Python-3.9.6.tgz


RUN pip3.9 install jupyter
RUN python3.9 -m pip install --upgrade pip

COPY mlp ./mlp
COPY Backend ./Backend
COPY Frontend ./Frontend
RUN pip3.9 install --no-cache-dir -r mlp/requirements.txt

RUN pip3.9 install --no-cache-dir -r Backend/requirements.txt

RUN apt-get install -y curl

RUN apt install build-essential libssl-dev -y

RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash
RUN apt install -y nodejs
RUN cd Frontend && npm install


EXPOSE 8000


CMD cd Backend/PredictingEarlyRetirement && python manage.py runserver 0.0.0.0:8000

