int oldVal = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(2, INPUT);
  pinMode(3, INPUT);
  pinMode(4, INPUT);
  pinMode(5, INPUT);
  pinMode(7,INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  int button = digitalRead(7);
  int left = digitalRead(2);
  int right = digitalRead(3);
  int up = digitalRead(4);
  int down = digitalRead(5);

  if(button==HIGH&&oldVal!=1){
    oldVal=1;
    Serial.println("pressed");
  }else if(button==LOW&&oldVal==1){
    oldVal=0;
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
  }else if(up&&down&&left&&right){
    Serial.println("center");
  }

  delay(1);
}
