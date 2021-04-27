int oldVal = 0;
int oldPot;
int movingPot=0;
int incomingData = 2;
bool downVal = false;
int val = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(2, INPUT);
  pinMode(3, INPUT);
  pinMode(4, INPUT);
  pinMode(5, INPUT);
  pinMode(7,INPUT);
  pinMode(A5,INPUT);
  pinMode(9,OUTPUT);
  pinMode(12,OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  int button = digitalRead(7);
  int left = digitalRead(2);
  int right = digitalRead(5);
  int up = digitalRead(3);
  int down = digitalRead(4);
  int pot = analogRead(A5);
  bool pressed = false;

//  if(button==HIGH&&oldVal!=1){
//    oldVal=1;
//    Serial.println("pressed");
//  }else if(button==LOW&&oldVal==1){
//    oldVal=0;
//  }
  if(button==HIGH){
    Serial.println("pressed");
    pressed = true;
  }else{
    pressed = false;
  }

  if(pot>oldPot+1&&(oldPot!=pot)&&pot-movingPot>200){
    movingPot = pot;
    Serial.println("potup");
    delay(10);
  }
  else if(pot<oldPot-1&&(oldPot!=pot)&&pot-movingPot<-200){
     movingPot = pot;
    Serial.println("potdown");
    delay(10);
  }
  if(!up&&left&&right){
    Serial.println("up");
  }else if(!down&&left&&right){
    Serial.println("down");
  }else if(!left){
    Serial.println("left");
  }else if(!right){
    Serial.println("right");
  }else if(!right&&!up&&left){
    Serial.println("rightup");
  }else if(!left&&!up&&right){
    Serial.println("leftup");
  }else if(!right&&!down&&left){
    Serial.println("rightdown");
  }else if(!left&&!down&&right){
    Serial.println("leftdown");
  }else if(up&&down&&left&&right&&!pressed){
    Serial.println("center");
  }

  if(Serial.available()>0){
    incomingData = Serial.read();
    if(incomingData==1){
      digitalWrite(12,HIGH);
    }else{
      digitalWrite(12,LOW);
    }
    if(incomingData==2){
      if(!downVal&&val<255){
        analogWrite(9,val);
        val+=1;
      }else if(downVal&&val>0){
        analogWrite(9,val);
        val-=1;
      }else if(val==255){
        downVal=true;
      }else if(val==0){
        downVal=false;
      }
      
    }else{
      analogWrite(9,0);
    }
  }


  oldPot = pot;

  delay(1);
}