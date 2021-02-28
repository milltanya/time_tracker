# Поднятие базы и джанго:
```
cd backend
sudo docker-compose build
sudo docker-compose up
sudo docker-compose run web python manage.py migrate
```
Все остальное делаем в другом терминале в той же директории
Создаем суперпользователя для админки
`sudo docker-compose run web python manage.py createsuperuser`

Нужно будет создать фиктивного пользователя с ником user(он пока что захардкожен в расширении) одним из способов:
1) В админке по адресу `127.0.0.1:8000/admin` вводим руками
2) Отправляем POST-запросы: 
* `'{"name": "dev"}'` на `127.0.0.1:8000/api/positions`
* `'{"name": "Vanya", "nickname": "user", "position": "dev"}'` на `127.0.0.1:8000/api/employees`
3) Делаем INSERT-запросы напрямую в базу с помощью SQL.

Как подключиться к базе из консоли или JDBC
1) Выполняем `sudo docker inspect backend_db_1 | grep Gateway` и копируем ip-адрес базы.
2) Используя адрес хоста, порт 5432, юзера time_tracker и пароль password, можем полключиться к базе. 
Пример для консоли: 
```
psql -h <адрес> -p 5432 -U time_tracker -W
<вводим пароль>
```
# Само расширение
В хроме в адресной строке вводим `chrome://extensions/`
Нажимаем `Load unpacker`
Выбираем папку `Extension`
С этого момента при смене вкладки или обновлении страницы данные начинают добавляться в базу
Выключить расширение можно в `chrome://extensions/`
