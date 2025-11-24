import {ProductComponent} from "../../components/product/index.js";
import {BackButtonComponent} from "../../components/back-button/index.js";
import {MainPage} from "../main/index.js";
import {Alerts} from "../../components/alerts/index.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent
        this.id = id
        this.alerts = null
    }
    
    getData() {
        const allProducts = [
            
            {
                id: 1,
                src: "https://upload.wikimedia.org/wikipedia/commons/8/81/Persialainen.jpg",
                title: "Персидская кошка",
                text: "Спокойный и ласковый характер, требует регулярного ухода за шерстью."
            },
            {
                id: 2,
                src: "https://i.pinimg.com/originals/20/3b/8d/203b8d10fa492f5fbe704687cf82e9b7.jpg",
                title: "Сиамская кошка",
                text: "Одна из самых известных пород с голубыми глазами. У сиамок короткая шерсть, светлый окрас с контрастными тёмными отметинами на ушах, мордочке, лапах и хвосте. "
            },
            {
                id: 3,
                src: "https://i.pinimg.com/736x/04/80/02/048002b0a03f6a011134054858466415.jpg",
                title: "Бенгальская кошка",
                text: "Энергичная, общительная, умная и любознательная порода, несмотря на «дикую» внешность."
            },
        ]
        
        // Находим продукт по ID, преобразуем this.id в число
        const productId = parseInt(this.id)
        return allProducts.find(product => product.id === productId)
    }

    getProductAlertContent() {
        const messages = {
            1: {
                title: "Персидская кошка", 
                content: "Пушистая аристократка с плоской мордочкой и большими выразительными глазами. Спокойный и ласковый характер. Требует регулярного ухода за длинной густой шерстью."
            },
            2: {
                title: "Сиамская кошка", 
                content: "Кошка с ее выразительной мордочкой и миндалевидными ярко-голубыми глазами — одна из самых узнаваемых и древних пород в мире. Сиамцы элегантны, стройны, умны и общительны."
            },
            3: {
                title: "Бенгальская кошка",
                content: "Это воплощение дикой красоты в обличье квартирного любимца. Эта удивительная порода — союз домашней кошки и азиатского леопардового кота. Бенгалы сразу приковывают взгляд экзотической внешностью."
            },
        }
        return messages[this.id] 
    }

    get pageRoot() {
        return document.getElementById('product-page')
    }

    getHTML() {
    return `
        <div id="product-page" >
            <div id="liveAlertPlaceholder" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1050; max-width: 500px; "></div>
            <button type="button" class="btn btn-primary"  id="liveAlertBtn">Показать живое уведомление</button>
        </div>
    `
    }
    
    clickBack() {
        const mainPage = new MainPage(this.parent)
        mainPage.render()
    }

    setupAlerts() {
        // Инициализируем систему уведомлений
        this.alerts = new Alerts(this.pageRoot)
        
        // Переопределяем обработчик кнопки для показа информации о продукте
        const alertTrigger = document.getElementById('liveAlertBtn')
        if (alertTrigger) {
            // Удаляем старый обработчик, если он есть
            alertTrigger.replaceWith(alertTrigger.cloneNode(true))
            
            // Добавляем новый обработчик с уникальным сообщением для каждой страницы
            document.getElementById('liveAlertBtn').addEventListener('click', () => {
                const alertContent = this.getProductAlertContent()
                const data = this.getData()
                
                if (data) {
                    // Создаем кастомное сообщение с HTML
                    const customMessage = `
                        <h4 class="alert-heading">${alertContent.title}</h4>
                        <hr>
                        <p class="mb-0">${alertContent.content}</p>
                    `
                    
                    // Используем разные типы уведомлений для разных страниц
                    const alertTypes = {
                        1: 'info',
                        2: 'warning', 
                        3: 'success'
                    }
                    const alertType = alertTypes[this.id] || 'success'
                    
                    // Вызываем соответствующий метод алерта с кастомным HTML
                    switch(alertType) {
                        case 'info':
                            this.alerts.alert(customMessage, 'info')
                            break
                        case 'warning':
                            this.alerts.alert(customMessage, 'warning')
                            break
                        case 'success':
                            this.alerts.alert(customMessage, 'success')
                            break
                        default:
                            this.alerts.alert(customMessage, 'success')
                    }
                } else {
                    this.alerts.error('Продукт не найден')
                }
            })
        }
    }

    render() {
        this.parent.innerHTML = ''
        const html = this.getHTML()
        this.parent.insertAdjacentHTML('beforeend', html)

        const backButton = new BackButtonComponent(this.pageRoot)
        backButton.render(this.clickBack.bind(this))

        const data = this.getData()
        
        // Добавляем проверку на случай, если продукт не найден
        if (!data) {
            console.error(`Product with id ${this.id} not found`)
            this.pageRoot.innerHTML = `<p>Продукт не найден</p>`
            return
        }
        
        const product = new ProductComponent(this.pageRoot)
        product.render(data)

        // Настраиваем систему уведомлений
        this.setupAlerts()
    }
}