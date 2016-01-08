####In Progress

#Smartframe



---

##The Project
This project started out as a idea for a christmas present. The requirements I came up with before starting were as follows: 

* It must be connected to an online source to keep content fresh.
* Once setup, require zero hands on configuration.
* Have a screen big enough to be viewable for someone with poor eye site.

I started by looking at products currently on the market, but I did not find any that really met all of my requirements, and 
the thought of building another peaked my interest enough to decide to build it.

###The Hardware

I chose parts based on the ease of assembly, and it is possible that there might be better options. I also purchased mostly everything from Amazon since
I was on a slight deadline, and I am an Amazon Prime Member. Below are the items I used.

note: Prices listed are the current price of the item at the time of writting this.

###### [Raspberry Pi](http://www.amazon.com/gp/product/B00T2U7R7I), $36 on Amazon.
###### [Tontec 10.1 Inches IPS Screen](http://www.amazon.com/gp/product/B00VE72DLC), $88 on Amazon.
###### [SanDisk Ultra 32GB microSDHC](http://www.amazon.com/gp/product/B010Q57T02), $13 on Amazon.
###### [Edimax Wi-Fi USB Adapter](http://www.amazon.com/gp/product/B003MTTJOY), $10 on Amazon.
###### [JBtek Jet Black Case](http://www.amazon.com/gp/product/B003MTTJOY), $8 on Amazon.
###### [12v 2a Power Adapter](http://www.amazon.com/gp/product/B00LHHPEVK), $10 on Amazon.
###### [DC Barrel Plug Converter, 2.1mm x 5.5mm to 2.5mm x 5.5mm](http://www.amazon.com/gp/product/B009AZSN14), $7 on Amazon.
###### [Generic brand USB3.0 4 port hub](http://www.amazon.com/gp/product/B00S4UDA96), $10 on Amazon.

#####Assembly Steps

* Connect the Screen to the Controller that came with it.
* Place the Pi into the case.
* Place the formatted SD card into the PI (Steps to format [here](https://www.raspberrypi.org/documentation/installation/noobs.md))
* Connect a mouse, keyboard, and the Wifi adapter.
* For Power I only wanted a single cable.  The screen required 12v2a (why I chose the usb hub).
    * The Power Adapter has 4 leads.  Plug 1 into the screen use the adapter to plug the other into the hub.
    * Connect a usb cable from the hub to the rasberry pi to power it.

###The Software

