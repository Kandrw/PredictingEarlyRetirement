NAME_DOCKER=docker_components_hacaton_26_10_24:v1

PROJECT=PredictingEarlyRetirement
PATH_PROJECT=/home/andrey/Видео

while getopts "crsaf" OPTION; do
    case $OPTION in
    s)

        docker build -t $NAME_DOCKER .
        exit;
    ;;
	c)
        docker build --cache-from=$NAME_DOCKER -t $NAME_DOCKER .
        exit;
    ;;
    r)
        docker run -it --rm -p 8888:8888 -v $PATH_PROJECT:$PATH_PROJECT -w $PATH_PROJECT/$PROJECT $NAME_DOCKER /bin/bash
        exit;
    ;;
    a)
        docker run -it --rm -p 8000:8000 -v $PATH_PROJECT:$PATH_PROJECT -w $PATH_PROJECT/$PROJECT $NAME_DOCKER 
        exit;
    ;;
    f)
        cd Frontend
        npm run dev
	*)
		echo "Incorrect option"
	;;
	esac
done

if [[ $OPTIND == 1 ]]; then

    echo "Not found command"
fi

echo "s - Сборка контейнера"
echo "c - Ускоренная пересборка контейнера, если уже до этого сброка осуществлялась"
echo "r - Запуск"
echo "a - Запуск сервиса"


