class CalcController{

    constructor(){

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._DateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.intialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    //ctrl c 
    copyToClickBoard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    //ctrl v
    pastrFromClickBoard(){

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);


        });


    }

    intialize(){
    
        this.setDisplayDateTime();

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

        this.setLasNumberToDisplay();
        this.pastrFromClickBoard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{

            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();

            });


        });

    
    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff;

    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            this._audio.play();
        }

    }

    //Eventos do teclado
    initKeyboard(){

        document.addEventListener('keyup', e=>{

            this.playAudio();

            switch(e.key){

                case 'Escape':
                    this.clearAll();
                    break;
                
                case 'Backspace':
                    this.clearEntry();
                    break;
                
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key);
                    break;
                
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '.':
                case ',':
                    this.addDot('.');
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
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if(e.ctrlKey) this.copyToClickBoard();
                    break;
            }
    


        });

    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event=>{
            element.addEventListener(event, fn, false);
        });

    }

    //Metodo Limpa todos o elementos do display
    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLasNumberToDisplay();
    }

    //Metodo Limpa apenas o ultimo elemento digitado
    clearEntry(){
        this._operation.pop();

        this.setLasNumberToDisplay();
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

    pushOperation(value){

        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();

            //console.log(this._operation);
        }


    }

    getResult(){

        try{
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setError();
            }, 1);
            
        }

    }

    calc(){
        let last = '';

        this._lastOperator = this.getLastItem();

        if(this._operation.length<3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }
        
        if(this._operation.length > 3){
            last = this._operation.pop();

            this._lastNumber = this.getResult();

        } else if(this._operation.length == 3){
            
            this._lastNumber = this.getLastItem(false);
        }

        //console.log('_lastOPerator',this._lastOperator);
        //console.log('_lastNumber',this._lastNumber);

        let result = this.getResult();

        if(last == '%'){

            result /= 100;

            this._operation = [result];

        }else{

            this._operation = [result];

            if(last) this._operation.push(last);

        }

        

        this.setLasNumberToDisplay();
    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operation.length-1; i>=0; i--){

                if(this.isOperator(this._operation[i]) == isOperator){
                    lastItem = this._operation[i];
                    break;
            }
        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLasNumberToDisplay(){

        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    //Metodo para adicionar numeros
    addOperation(value){


        if(isNaN(this.getLastOperation())){
            
            //String
            if(this.isOperator(value)){
                
                //Trocar o operador
                this.setLastOperation(value);

            }else{
                this.pushOperation(value);
                this.setLasNumberToDisplay();
            }
        }else{

                if(this.isOperator(value)){

                    this.pushOperation(value);


                }else{
                    let newValue = this.getLastOperation().toString() + value.toString();
                    this.setLastOperation((newValue));

                    //Atualizar Display
                    this.setLasNumberToDisplay();
                }
                

            }
        

    }

    //Metodo caso o usuario digite uma opcao invalida
    setError(){

        this.displayCalc  = "Error";

    }

    addDot(){

        let lastOPeration = this.getLastOperation();

        if(typeof lastOPeration == 'string' && lastOPeration.split('').indexof('.') > -1) return;

        if(this.isOperator(lastOPeration) || !lastOPeration){

            this.pushOperation('0.');

        }else{
            this.setLastOperation(lastOPeration.toString() + '.');
        }

        this.setLasNumberToDisplay();

    }

    execBtn(value){

        this.playAudio();

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
                this.calc();
                break;

            case 'porcento':
                this.addOperation('%');
                break;

            case 'ponto':
                this.addDot('.');
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

        if(value.toString().length>10){
            this.setError();
            return false;
        }

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

