#FROM ubuntu:22.04
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
# COPY mlp/requirements.txt ./mlp/requirements.txt
COPY mlp ./mlp
COPY Backend ./Backend
COPY Frontend ./Frontend
RUN pip3.9 install --no-cache-dir -r mlp/requirements.txt

RUN pip3.9 install --no-cache-dir -r Backend/requirements.txt

RUN apt-get install -y libssl-dev
# RUN apt-get install build-essential checkinstall
RUN apt-get install -y curl
#RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
# RUN apt-get -y update

# RUN apt install -y nodejs gcc g++ make -y
# RUN apt install -y nodejs
# RUN apt install -y npm
RUN apt install build-essential libssl-dev -y
#RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash
RUN apt install -y nodejs
RUN cd Frontend && npm install

# RUN source ~/.bashrc
# RUN nvm install 14.0
#EXPOSE 8888
#EXPOSE 5173
EXPOSE 8000

ENV CMD_TYPE="jupyter"

# CMD if [ "$CMD_TYPE" = "jupyter" ]; then \
#         jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser --allow-root --NotebookApp.default_url='/notebooks/PredictingEarlyRetirement/mlp/sample.ipynb' --NotebookApp.token='' --NotebookApp.password=''; \
# else \
#     cd Frontend && npm run dev; \
# fi
#CMD cd Frontend && npm run dev
CMD cd Backend/PredictingEarlyRetirement && python manage.py runserver 0.0.0.0:8000

# CMD ["sh", "-c", "if [ \"$CMD_TYPE\" = \"jupyter\" ]; then \
#     jupyter notebook --ip=0.0.0.0 --port=8888 --no-browser --allow-root --NotebookApp.default_url='/notebooks/PredictingEarlyRetirement/mlp/sample.ipynb' --NotebookApp.token='' --NotebookApp.password=''; \
# else \
#     npm run dev; \
# fi"]

# CMD ["jupyter", "notebook", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.default_url='/notebooks/PredictingEarlyRetirement/mlp/sample.ipynb'", "--NotebookApp.token=''", "--NotebookApp.password=''"]
# CMD npm run dev
