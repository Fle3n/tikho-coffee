import { products, services, recommendDrink, telegram } from './data.js';
import { money } from './ui.js';
import { icon } from './icons.js';

export function mountAssistant(root,site){
  const config={
    coffee:{name:'Ваш бариста',hello:'Какой кофе вам нравится: мягкий, крепкий или сладкий? Подберу напиток и учту бюджет.',chips:['Нежный на овсяном','Без молока','Без кофе до 300 ₽']},
    clinic:{name:'Координатор Линии',hello:'Помогу разобраться в направлениях и выбрать время знакомства. О чём хотите спросить?',chips:['Первый визит','Стоимость','Обсудить прикус']},
    flow:{name:'Помощник по проекту',hello:'Расскажите, что хотите автоматизировать. Помогу выбрать тип проекта и перенесу задачу в бриф.',chips:['Бот для записи','Сайт с каталогом','Поиск по документам']}
  }[site];
  root.classList.add('chat');
  root.innerHTML=`<div class="chat-head"><h3>${config.name}</h3>${icon('chat')}</div><div class="chat-log" role="log" aria-live="polite" aria-relevant="additions" tabindex="0"></div><div class="chat-suggestions" aria-label="Примеры вопросов"></div><form class="chat-form"><label class="field"><span class="sr-only">Вопрос помощнику</span><input name="question" maxlength="600" required autocomplete="off" placeholder="Напишите вопрос"></label><button class="icon-button" aria-label="Отправить вопрос">${icon('arrow')}</button></form><p class="chat-caption">Локальный помощник по данным сайта</p>`;
  const log=root.querySelector('.chat-log'), input=root.querySelector('input'), suggestions=root.querySelector('.chat-suggestions');
  function say(text,user=false,actions=[]){
    const bubble=document.createElement('div');bubble.className='chat-message'+(user?' user':'');
    const p=document.createElement('p');p.textContent=text;bubble.append(p);
    if(actions.length){const group=document.createElement('div');group.className='actions';for(const action of actions){const button=document.createElement(action.href?'a':'button');button.className='btn secondary';button.textContent=action.label;if(action.href){button.href=action.href;button.target='_blank';button.rel='noopener noreferrer'}else{button.type='button';button.addEventListener('click',action.run)}group.append(button)}bubble.append(group)}
    log.append(bubble);while(log.children.length>30)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;
  }
  const send=(name,detail)=>document.dispatchEvent(new CustomEvent(name,{detail}));
  const contact={label:'Написать @fle3n',href:telegram};
  function ask(original){
    original=original.trim().slice(0,600);if(!original)return;input.value='';say(original,true);const text=original.toLowerCase().replace(/ё/g,'е');
    if(/кто ты|какая модель|настоящий ии/.test(text)){say('Я локальный помощник по данным сайта. Внешняя языковая модель не подключена. По разработке можно связаться с @fle3n.',false,[contact]);return}
    if(/контакт|разработчик|связаться|ватсап|whatsapp/.test(text)){say('По разработке этого сайта пишите @fle3n в Telegram.',false,[contact]);return}
    if(site==='coffee'){
      if(/корзин|заказ|чек/.test(text)){say('В заказе можно изменить количество и скачать демонстрационный чек.',false,[{label:'Открыть заказ',run:()=>send('portfolio:cart',{})}]);return}
      if(/выпеч|круасс|куки|булоч/.test(text)){const list=products.filter(p=>p.category==='bakery');say(list.map(p=>`${p.name}: ${money(p.price)}`).join('\n'),false,list.map(p=>({label:p.name,run:()=>send('portfolio:product',{id:p.id})})));return}
      if(!/кофе|нежн|мягк|крепк|сладк|молок|напит|овсян|освеж|матч|какао|лимонад|бюджет/.test(text)){say('Подберу напиток по вкусу и бюджету. Например: «мягкий кофе на овсяном до 300 рублей».');return}
      const budget=text.match(/(?:до|бюджет|за)\s*(\d{2,4})/);
      const options={kind:/без кофеина|освеж|лимонад/.test(text)?'fresh':/без кофе|не кофе|какао|матч/.test(text)?'no-coffee':'coffee',flavor:/сладк|какао|шокол|ванил/.test(text)?'sweet':/крепк|насыщ/.test(text)?'strong':'soft',milk:/без молока|черн/.test(text)?'none':/овсян|раститель/.test(text)?'oat':'regular',budget:budget?Number(budget[1]):Infinity};
      const result=recommendDrink(options);
      if(!result){say('Подходящего напитка в этом бюджете нет. Фильтр-кофе стоит 190 ₽, какао 250 ₽, лимонад 270 ₽. Можно изменить бюджет.');return}
      say(`${result.name}, ${money(result.total)}. ${result.flavor||result.note}.${result.milk==='oat'?' В цену включено овсяное молоко.':''}`,false,[{label:'Выбрать напиток',run:()=>send('portfolio:product',{id:result.id,milk:result.milk})}]);return;
    }
    if(site==='clinic'){
      if(/болит|боль|кров|отек|температур|симптом|лекарств|диагноз/.test(text)){say('Я помогаю с организацией визита. Диагноз и лечение обсуждают с врачом после осмотра. Здесь можно попробовать демонстрацию записи.',false,[{label:'Открыть запись',run:()=>send('portfolio:book',{service:'check'})}]);return}
      if(/цен|стоим|скольк/.test(text)){say(services.map(s=>`${s.name}: от ${money(s.price)}`).join('\n')+'\nЭто демонстрационный прайс.',false,[{label:'Выбрать консультацию',run:()=>send('portfolio:book',{service:'check'})}]);return}
      if(/бою|страш/.test(text)){say('Первую встречу можно начать с разговора: обсудить ожидания, вопросы и удобный темп приёма.',false,[{label:'Запланировать знакомство',run:()=>send('portfolio:book',{service:'check'})}]);return}
      const id=/прикус|ортодонт|брекет/.test(text)?'ortho':/восстан|корон/.test(text)?'restore':/лечен|кариес/.test(text)?'treatment':'check';const service=services.find(s=>s.id===id);
      say(`${service.name}. ${service.description} На знакомство отводится ${service.duration} минут.`,false,[{label:'Подобрать время',run:()=>send('portfolio:book',{service:id})}]);return;
    }
    const type=/бот|телеграм|telegram/.test(text)?'bot':/документ|автоматизац|баз.*знан|ии|ассистент|помощник/.test(text)?'ai':'website';
    const name={bot:'Telegram-бот',ai:'Автоматизация и AI',website:'Сайт для бизнеса'}[type];
    const selected=[];if(/запис/.test(text))selected.push('booking');if(/каталог/.test(text))selected.push('catalog');if(/документ|знан/.test(text))selected.push('knowledge');
    say(`${name} подходит как отправная точка. В брифе уточним функции, результат и желаемый срок. Цену и окончательный объём согласует разработчик.`,false,[{label:'Подготовить бриф',run:()=>send('portfolio:brief',{type,goal:original,selected})},contact]);
  }
  for(const question of config.chips){const button=document.createElement('button');button.type='button';button.textContent=question;button.addEventListener('click',()=>ask(question));suggestions.append(button)}
  root.querySelector('form').addEventListener('submit',event=>{event.preventDefault();ask(input.value)});
  root.addEventListener('assistant:ask',event=>ask(event.detail));say(config.hello);
  return {ask,focus:()=>input.focus()};
}
