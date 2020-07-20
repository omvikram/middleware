FROM centos:7

RUN \
  yum install -y wget epel-release gcc-c++ && \
  wget https://rpm.nodesource.com/pub_12.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm && \
  rpm -ivh nodesource-release-el7-1.noarch.rpm && \
  yum -y install nodejs && \
  yum install -y bzip2 && \
  npm install -g pm2 && \
  yum clean all

RUN yum install -y nginx python-setuptools && \
  easy_install supervisor && \
  rm -f /etc/localtime && \
  ln -s /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && \
  mkdir -p /etc/supervisord.d /logs

# copying nginx config
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf
COPY config/nginx/nginx_ingobff.conf /etc/nginx/conf.d/ingobff.conf

# copying package.json and newrelic
COPY newrelic.js /usr/local/ingo/bff/newrelic.js

COPY config/supervisord.conf /etc/supervisord.conf
COPY config/services.conf /etc/supervisord.d/services.conf
COPY config/supervisord /etc/rc.d/init.d

RUN chmod 755 /etc/rc.d/init.d/supervisord

# create and set app directory
WORKDIR /usr/local/middleware

ARG BUILD_ENV

ENV NODE_ENV=${BUILD_ENV}

COPY package.json /usr/local/ingo/bff/package.json

RUN npm install

RUN cd /usr/local/ingo/bff

COPY ./ /usr/local/ingo/bff

EXPOSE 80

CMD ["/usr/bin/supervisord", "-n"]

# CMD [ "npm", "run", "start" ]

# build -> docker build --build-arg BUILD_ENV=development -t ingobff .
# run -> docker run --name bff2 ingobff
# container-ssh -> docker exec -it f8f5d573a335 /bin/bash 