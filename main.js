;
const login = 'login'; //Логин
const password = 'password'; //Пароль
const SiteAdress = 'https://manga-chan.me/'; //ссылка на сайт
//максимальное время на загрузку страницы (на загрузку файла значение умножается на 10)
const TimeOut = 60000; //в мс

//путь к папке с архивами. обязательно замените \ на /
//если папка лежит там же где и main.js можно просто написать './Folder'
const Source = 'C:/Path/archives'; 

//true - включает отображение браузера, false - выключает
VisibaleMode = false; 

//——————————————————————————————————————————
//——————————————————————————————————————————


var AdmZip = require('adm-zip');
const fs = require('fs');
const { readdirSync, rename } = require('fs');
const puppeteer = require('puppeteer');

    console.log("Status: Подключение к " + SiteAdress);
    console.log();

try { (async () => {
  const browser = await puppeteer.launch({
    headless: !VisibaleMode
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 800,
    height: 800
  });

    console.log("Status: Подключение успешно!");
    console.log();
    console.log("Status: Вход в Аккаунт: " + login);
    console.log();

  await page.goto(SiteAdress);

  const inputLoginSelector = 'input[placeholder="Логин"]';
  const inputPasswordSelector = 'input[placeholder="Пароль"]';
  await page.waitForSelector(inputPasswordSelector, {timeout: TimeOut});
  await page.type(inputLoginSelector, login);
  await page.type(inputPasswordSelector, password);

  const EnterBtnSelector = 'input[value="Вход"]';
  await page.click(EnterBtnSelector);

    console.log("Status: Успешный Вход!");
    console.log();


//удаление ' [mangalib.me]'
try{ 
  const files = readdirSync(Source);
  files.forEach(file => rename(

    Source + `/${file}`,
    Source + `/${file.split('[mangalib.me]')[0].split('.zip')[0]+'.zip'}`,
    err => 1
  ));
}catch(err){};

fs.readdir(Source, async function(err, items) {


    console.log("Status: Кол-во архивов: " + (items.length - 1));
    console.log();



   //обозначение имени, главы и тома
   for (var i=1;i<items.length;i++){



      var MangaTom = Number(items[i].split('Том ')[1].split(' Глава')[0]);
      var MangaName = items[i].split('Том')[0];
      var MangaGlava = Number(items[i].split('Глава ')[1].split('.zip')[0]);

    console.log("Status: Загружается: " + MangaName +'Том ' + MangaTom+ ' Глава ' + MangaGlava);


    //удаление последнего файла в архиве
    try{var zip = new AdmZip(Source+'/'+String(items[i]));
    var zipEntries = zip.getEntries();
    var CountOfFilesInZip = 0;
    zipEntries.forEach(function(zipEntry) {
      CountOfFilesInZip++;
    })
    CountOfFilesInZip --;
    zip.deleteFile((String(CountOfFilesInZip)+".png"))
    zip.writeZip(Source+'/'+String(items[i]))
  }catch(err){};


    //поиск манги
    const inputSearchSelector = 'input[placeholder="Ищем мангу, серию, автора..."]';
    await page.waitForSelector(inputSearchSelector, {timeout: TimeOut});
    await page.type(inputSearchSelector, MangaName)

    // const SearchSelector = 'img[id="search_button"]';
    // await page.waitForSelector(SearchSelector, {timeout: TimeOut});
    // await page.click(SearchSelector);

    //const MangaPageSelector = '#dle-content > div.content_row > div.manga_row1 > div > h2 > a';
    const MangaPageSelector = '#searchsuggestions > a';
    await page.waitForSelector(MangaPageSelector, {timeout: TimeOut});
    await page.click(MangaPageSelector);

    //const addchapterSelector = '#dle-content > div.ext' > metoda; //расположение ' уточнить
    const addchapterSelector = '#dle-content > div.ext > a:nth-child(1)';
    await page.waitForSelector(addchapterSelector, {timeout: TimeOut});
    await page.click(addchapterSelector);

    const inputTomSelector = 'input[name="xfield[vol]"]';
    await page.waitForSelector(inputTomSelector, {timeout: TimeOut});
    await page.type(inputTomSelector, String(MangaTom));
    const inputGlavaSelector = 'input[name="xfield[ch]"]';
    await page.type(inputGlavaSelector, String(MangaGlava));
    const inputFileSelector = 'input[name="xfield_manga"]';
    
    try{const [fileChooser] = await Promise.all([
      page.waitForFileChooser({timeout: TimeOut*10}),
      page.click(inputFileSelector),
    ]);
    await fileChooser.accept([Source+'/'+String(items[i])]);
    }catch(err){};

    const ButtonToModerSelector = 'button[name="add"]';
    await page.click(ButtonToModerSelector, {timeout: TimeOut / 10});
    
    const AddMoreSelector = '#wrap > div.main_fon > table > tbody > tr:nth-child(2) > td.news > a:nth-child(1)'
    await page.waitForSelector(AddMoreSelector, {timeout: TimeOut*10});
    console.log("Status: Загрузка завершена");

    console.log("Status: Загружен " + i +'й архив из ' + (items.length - 1));
    console.log();
  }
console.log("FINALE! if programm doesn't close, just close it");
});

await new Promise (r => {});

await browser.close();})();
}catch(err){};
