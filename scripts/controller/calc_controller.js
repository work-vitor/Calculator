class CalcController{

    constructor(){

        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._DateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.intialize();
        this.initButtonsEvents();

    }

    intialize(){
    
        this.setDisplayDateTime();

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

    
    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event=>{
            element.addEventListener(event, fn, false);
        });

    }

    //Metodo Limpa todos o elementos do display
    clearAll(){
        this._operation = [];
    }

    //Metodo Limpa apenas o ultimo elemento digitado
    clearEntry(){
        this._operation.pop();
    }

    //Metodo para pegar ultima posicao do array
    getLastOperation(){

        return this._operation[this._operation.length-1];

    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value){
        return(['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

    //Metodo para adicionar numeros
    addOperation(value){

        console.log('A', value, isNaN(this.getLastOperation()));

        if(isNaN(this.getLastOperation())){
            
            //String
            if(this.isOperator(value)){
                
                //Trocar o operador
                this._setLastOperation(value);

            }else if(isNaN(value)){
            
                //outra coisa
                console.log(value);

            }
            else{

                if(this.isOperator(value)){
                    this._operation.push(value);
                }else{

                }
                this._operation.push(value);

            }

        }else{
            
            //Number
            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(parseInt(newValue));

        }

        console.log(this._operation);

    }

    //Metodo caso o usuario digite uma opcao invalida
    setError(){

        this.displayCalc  = "Error";

    }

    execBtn(value){

        switch(value){

            case 'ac':
                this.clearAll();
                break;
            
            case 'ce':
                this.clearEntry();
                break;
            
            case 'soma':
                this.addOperation('+');
                break;
            
            case 'subtracao':
                this.addOperation('-');
                break;
            
            case 'divisao':
                this.addOperation('/');
                break;
            
            case 'multiplicacao':
                this.addOperation('*');
                break;
            
            case 'igual':
                //th
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'ponto':
                this.addOperation('.');
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;
        }


    }

    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        

        buttons.forEach((btn, index)=>{
            
            this.addEventListenerAll(btn, 'click drag ', e=>{

                let textBtn = btn.className.baseVal.replace("btn-", "");

                this.execBtn(textBtn);
    
    
            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e=>{

                btn.style.cursor = "pointer";
                
            });


        });

    }

    //Metodo para mostrar a data e hora atual
    setDisplayDateTime(){
        this.displayDate = this.currentDate.toLocaleDateString(this._locale,{
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }
    
    set displayTime(value){
        this._timeEl.innerHTML = value;
    }

    get displayDate(){
        return this._DateEl.innerHTML;
    }

    set displayDate(value){
        this._DateEl.innerHTML = value;
    }


    get displayCalc(){
        //get mostra o valor do metodo        
        return this._displayCalcEl.innerHTML;

    }

    set displayCalc(value){
        //set atribui valor ao metodo
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate(){
        return new Date();
    }

    set dataAtual(value){
        this._currentDate = value;
    }

}
