# Manga-Chan-AutoLoader
AutoLoader of .zip for manga-chan.me / автозагрузчик .zip архивов для manga-chan.me

ДЛЯ РАБОТЫ НЕОБХОДИМ УСТАНОВЛЕННЫЙ Node.js  https://nodejs.org/

Если у вас не установлены adm-zip, file-system и puppeteer (или вы не знаете
что это такое) перед первым запуском запустит puppeteer.bat, file-system и adm-zip.bat

Для работы скрипта необходимо указать путь с папкой где лежат 
ТОЛЬКО .zip архивы, которые надо будет загрузить.

Для настройки скрипта необходимо открыть файл main.js через любой 
текстовый редактор и задать необходимые параметры в самом начале.

Перед запуском убедитесь что архивы не открыты в других программах, 
разблокированы и доступны для редактирования.

Перед загрузкой убедитесь что страница с мангой уже существует 
и находится в выпадающем меню поиска по названию манги в имени архива.

Для изменения сайта загрузки, необходимо в main.js изменить ссылку на ресурсы -chan.me

Использованы Node.js, adm-zip, puppeteer, file-system
By DedLigma
https://github.com/DedLigma/