<div id="table-of-contents">
<h2>Table of Contents</h2>
<div id="text-table-of-contents">
<ul>
<li><a href="#sec-1">1. In Brief</a></li>
<li><a href="#sec-2">2. How you can use it</a></li>
<li><a href="#sec-3">3. Quick Start Guide</a></li>
<li><a href="#sec-4">4. Who made it?</a></li>
<li><a href="#sec-5">5. How It's Different</a></li>
<li><a href="#sec-6">6. How It Works</a></li>
<li><a href="#sec-7">7. How to Use Scrollback</a></li>
<li><a href="#sec-8">8. User Experience</a></li>
<li><a href="#sec-9">9. Short Descriptions</a></li>
<li><a href="#sec-10">10. Features</a></li>
<li><a href="#sec-11">11. User Guide</a></li>
<li><a href="#sec-12">12. Administrator Guide</a></li>
<li><a href="#sec-13">13. Developer Guide</a></li>
<li><a href="#sec-14">14. Pricing, or How We Make Money</a></li>
<li><a href="#sec-15">15. Support</a></li>
<li><a href="#sec-16">16. FAQ</a></li>
</ul>
</div>
</div>

<div align="center">

If your community uses text chat
but has outgrown IRC, Skype, or Campfire
then embed a Scrollback chat in your website
and let the conversation flow!

</div>

# In Brief

Scrollback makes it easy for friends, colleagues, and customers to create community and sustain a sense of belonging on the web and on mobile, using the power of open text chat.

Our UX wizards have reinvented the text chat experience for the 21st century.

The granddaddy of open text chat, IRC, was invented in 1988. It hasn't changed much since.

Scrollback combines all the lessons learned from IRC with the ease-of-use of an embeddable web app and the power of a cloud service.

We added social and anti-abuse features to make it super engaging for users and super convenient for community managers.

And of course it works across platforms and across online media &#x2013; we connect to mobile, to email, to Twitter, to Facebook.

# How you can use it

Using Scrollback, you can embed a live *chatstream* into any webpage.

A chatstream can host a long-lived, interactive *community* that's stickier and more engaging than any forum system.

Or it can spawn ad-hoc, disposable threads for short-term collaboration and quick decision-making.

# <a id="Quick-Start-Guide" name="Quick-Start-Guide">Quick Start Guide</a>

A Scrollback web chat is embedded in this web page. It's already live. You're in the Welcome chat by default.

Create a new chat by giving it a name. (If it already exists, you'll join it.)

Sign in with Facebook or Github. (Soon, Google or LinkedIn too.)

Invite your friends using the **/summon** command.

            > /summon Charlie Smith
    #Welcome: inviting Charlie Smith from Facebook to join this chat.

Click the pop-out button to give the chat its own browser window.

Now you can bookmark the page, share the URL, and return to that conversation anytime.

# Who made it?

We're a team of developers who got tired of IRC.

New chat systems have been appearing for the past 20 years, but none of them achieves the combination of openness and stickiness that IRC does so well.

Paul Graham [once said of Twitter](http://ycombinator.com/rfs3.html): "It’s really more of a discovery than an invention; that square was always there in the periodic table of protocols, but no one had quite hit it squarely."

IRC is a different square in that table. Scrollback is in the same column, a few rows down.

We wrote Scrollback primarily to support communities of developers like us.

Being web developers, we naturally put Scrollback into the web projects we built. So we engineered it for the mainstream user, too.

# <a id="How-It-s-Different" name="How-It-s-Different">How It's Different</a>

Open text chat platforms are **stickier and more engaging** than any forum system. Being community-based, they are more **sustainable** than commercial chat support.

## How is it different from other chat systems?

*For a longer, more academic treatment of chat systems, see Genera of Text Chat.*

Open text chat is *different* to IM or friends-only messaging systems, which are usually one-to-one or **private** to small groups.

Communities around opensource technologies, Kickstarter projects, or consumer brands are larger and **open by default**. They need different tools.

What about IRC? IRC is the great grand-daddy of social text chat. But it predates the Web. It predates mobile.

Most people use text chat for **private**, one-on-one discussion (like SMS text messages) or for small groups of friends (Facebook Chat, WhatsApp, Campfire).

By contrast, Scrollback's communities are **public** by default. They must be, because we serve open communities. Open communities include communities of practice (CoP) and communities of interest (CoI) as well as others.

What's a community of practice? Developers who use Node.JS. Entrepreneurs actively working on a startup.

What's a community of interest? Sports fans. Harley Davidson riders. People who like cat photos.

We serve other kinds of communities, too &#x2013; groups of friends and family, co-workers within an organization, even pairs of lovers.

With open chat, the first massive challenge is abuse. Spammers and griefers

The second challenge is establishing a vibrant sense of community. We've all seen tumbleweed chatrooms: the lights are on, but nobody's home.

Experience it for yourself &#x2013; jump in to the Quick Start Guide.

## How is it different from IRC?

Scrollback supports scrollback. IRC doesn't. If you're not on the channel when somebody says something, it's gone forever.

Scrollback is easily embeddable into web pages. Just paste a snippet of HTML and you get an interactive Scrollback window into the chatstream of your choice.

Scrollback has a bunch of other useful features.

# How It Works

Communities manifest in public or private chatstreams, which support powerful threaded conversations.

Scrollback hosts thousands of technical communities. We've pre-registered a Scrollback community for every project on Github.

We also host thousands of nontechnical communities. Brands, sports, close-knit groups of friends and family.

Some communities are public. Some are private. Some are in between &#x2013; what we call friends-of-friends.

## Problems we Solve

### The tumbleweed problem

Communities require a certain minimum level of traffic to be viable. Below that minimum of responsiveness and activity, a community feels like a ghost town. "Hello? Is anybody around?" That's the tumbleweed problem.

We solve this problem in a number of ways.

1.  Permeable Thread Boundaries

    Scrollback knows exactly how many users on a thread are actively monitoring it and how many are idle or AFK.
    
    If a user joins a dormant thread, their questions will, if possible, automatically bubble to any parent, sibling, or child threads which contain more active users.

2.  Scrollback Auto-search

    We borrow a technique from Google Instant and from Quora. When a user asks a question, we automatically search through the history of the current thread and related threads. In that way, the chatstream itself responds to the user.

3.  Configurable Autoresponses

    Members of a chatstream can configure autoresponses to fine-tune Scrollback's behaviour.
    
                  > /define problem.*windows = have you tried rebooting?
                  < autoresponse defined for chatstream #TechHelp.
        
           <newbie> Hi, I'm having a problem with my Windows laptop.
        <#TechHelp> have you tried rebooting?

### Backward Compatibility

If an existing, active IRC community exists, we gateway to it, instead of trying to compete with it.

# How to Use Scrollback

Scrollback contains millions of **Chatstreams**.

Some Chatstreams exist for mere minutes. For example, if a group of people are dialed in to a conference call, creating a chatstream for that meeting is the fastest, easiest way to get everyone sharing a chat.

Some Chatstreams persist for years. Imagine a community of software developers. They come and go. They fork conversations into special interest groups. But the overall identity of the community remains.

Members join and unjoin a particular Chatstream.

(future feature) You can fork a chatstream. When we talk about forked chatstreams, we sometimes refer to them as **threads**.

# User Experience

After you participate in a Chatstream, we'll automatically save that Conversation to your History, so you can go back and review any Conversations that you participated in.

# Short Descriptions

## We are the most frictionless way to create a strong online community. A Scrollback chatroom is a URL away.

# Features

Scrollback is designed with the modern web in mind. Features include:

-   Social media integration make it easy to retweet a useful or funny conversation.

-   Social network integration makes it easy to summon friends into a chat.

-   Web integration simplifies away many of the awkward pain points of IRC.

## Embeddable into any Website

Paste our embed string into any web page to get a Scrollback portal as a widget in your web page. Users can pop out that portal to enter the full Scrollback UI.

## Look and Feel integration

We use Javascript to makes the Scrollback widget look like a seamless part of your website, using your colours, fonts, and styles.

## Fully Webby

### If you drag a URL into the chat, it gets posted to the chat

## URL Preview

When somebody posts a URL, a preview of the page shows up in the right margin.

## Infinite Scrollback

Every chatstream's scrollback is stored forever and searchable.

## Pin text

Each chatstream can define certain keywords which, if they are defined in the course of conversation, will cause those utterances to be pinned to the top of the chatstream.

    > /add pintext NewbieGuide
    < "NewbieGuide" will be pinned to your chatstream.
    < You have 3 pins remaining.
    
    > NewbieGuide is available at http://example.com/blah/blah
    < before: NewbieGuide needs to be written
    < after:  NewbieGuide is available at http://example.com/blah/blah

## Smart URLs

Every conversation has a URL. Inviting someone to join a thread is as easy as sharing the URL. You can bookmark useful conversations and come back to them weeks or years later.

    http://askabt.com/scrollback/868#bacon1

## Built-In Nopaste

If you paste a source code segment larger than 5 lines, we auto-collapse it, so it doesn't disrupt the rest of the chatstream. Other chatstream members can automatically expand and collapse your text.

Thus is Pastebin built in.

Your text will automatically pin to the left margin so you can discuss it without it disappearing and scrolling off to the top of the screen.

         > Hey guys, can you help me with my code?
    <Guru> Sure, what is ur problem now?
         > It doesn't work.
    <Guru> Sigh, you'd better show us.
         > OK here goes.
         > #include <stdio.h>
         > int main(void)
         > {
         >     printf("Hello world\n');
         >     return 0;
         > }

## Built-In Document Sharing

## Intuitive, flexible joins and leaves

Suppose you're in a chatstream with Bob and Charlie. You decide that David should be involved in this conversation. You can add David. David will have access to the scrollback in the chatstream. He can read the scrollback to catch up to the context of your conversation.

By default, David will see the last 24 hours of scrollback. If you want him to see more scrollback, any chatstream moderator, or the person who added David, can easily tweak this: just right-click on David's name and tweak his access accordingly, to have "full scrollback". David can also request more scrollback.

You can configure your chatstreams to allow 24 hours or infinite scrollback by default.

## Automatic Geolocation Segmentation

Large communities usually organize into geographic chapters. If a community becomes too large, the community manager can flip a switch and divide it by geography. Members segment into the appropriate zone, which is sized automatically by the Scrollback backend &#x2013; East Coast vs West Coast, by state, by city.

## Multithreading support

With the same group of people, at the same time, multiple conversations can overlap. We organize threads of conversation visually so you can stay clear in your mind.

## Smart Scrollbar

Most scrollbars are linear with text. Our smart scrollbar is linear with time &#x2013; it shows conversations and presence.

## Filters

-   Ignore all guest members.

-   Prioritize messages from your Facebook friends.

## Expanding Ripples

If you need help, and nobody's around, your questions automatically spread to nearby chatstreams.

The "Cry for Help" is a text bubble that floats across a user's screen at most once a minute. Users can turn it off. It contains questions from nearby communities.

What is a nearby community? It is a community which belongs to the same categories as the initial community.

## Social Network and Social Media Integration

Our powerful social features reach beyond text chat to give you integration with Twitter, Facebook, and LinkedIn.

### Easy Tweety

Did somebody just say something profound? Tweet it.

### Instant Dossier

Did somebody just join the channel? Their Facebook and LinkedIn profiles are only a click away. Hover over their avatar/nickname to see more about them.

## Other Third Party Integrations

### Evernote Integration

saves the entire scrollback into an evernote notebook for you. that evernote notebook is updated with daily logs of the chat.

### IFTTT Integration

Define triggers in your chatstreams that connect to IFTTT for further scriptable actions.

The functionality that has traditionally required a separate IRC Bot can now be configured directly into your chatstreams.

## Multimedia Integration

Scrollback does not support video or voice chat directly. Instead, it supports easy call-outs to Skype, ooVoo, and 3rd party multimedia chat providers.

## Continuous Partial Attention

The last thing you need is another messaging medium &#x2013; if it's just another source of noise and bother.

We know that your attention is the scarcest resource you have. We respect and conserve it in a number of ways.

### Etiquette

The etiquette of Scrollback honors your right to go AFK: to go offline, away from the keyboard, in the real world.

### Summary

Scrollback automatically accretes a summary of what happened while you were away. It emails you that summary once a day so you can catch up.

### Triage Pane

The web interface gathers into a single view all communications directed at you. It lets you dismiss the ones that have gone stale, leaving only those that deserve a response.

### Priority Invocations

If you're expecting an urgent communication, you can tell Scrollback to notify you by mobile or email, to summon you back to the chat.

## Customization

We're designed to be embedded. It's easy for you to re-skin Scrollback to match your existing look and feel.

# User Guide

This part of the guide helps users get the most out of Scrollback.

## Interfaces

You probably encountered Scrollback for the first time as an embeddable pop-up chat window in a website somewhere. That chat widget is a window into the universe of Scrollback chats. To explore that universe, click the pop-out button.

# Administrator Guide

## Chatstream Deletion

By default, every chatstream is stored forever. Chatstream owners can delete all or part of a chatstream.

# Developer Guide

This part of the guide is for developers who want to:

-   embed a Scrollback chatstream in their own websites

-   make API calls against the Scrollback API

## Theory

### Primitives

What is a conversation?

It is a combination of three primitives:

1.  People

2.  Topic (subject matter)

3.  Time period

Any two of those three is sufficient to identify a conversation.

### <a id="Genera-of-Text-Chat" name="Genera-of-Text-Chat">Genera of Text Chat</a>

Our classification of text chat media prefers the term "genre" to "generation" because the affordances and modalities of chat media tend to recur across platforms and over time. Systems such as Habitat (1986) and Second Life (2003) share a thread; so do CU-SeeMe (1992) and ooVoo (2007).

1.  1st Gen: one-to-one text talk

    Text-only, generally one-to-one, private chats.
    
    -   SMS
    
    -   Unix talk
    
    -   ICQ
    
    -   AIM
    
    -   basic Jabber and Google Talk
    
    -   basic Facebook Messenger

2.  2nd Gen: multi-user social text chat

    Text-only, multi-user chats introduce a public/private dimension, with ACLs that include *invite only* and *secret* modes.
    
    -   AOL Chatrooms
    
    -   IRC
    
    -   MUDs and MOOs
    
    -   Facebook Chats

3.  3rd Gen: multimedia integration

    Going beyond text to voice and video chat. The public/private dimension remains, but typically retreats to small groups of friends. Appearance of visual avatars.
    
    -   Skype
    
    -   iChat
    
    -   ooVoo
    
    -   Habitat
    
    -   Second Life
    
    -   MMORPGS
    
    -   Chatroulette is notable as an extreme case for its flagship, exhibitionistic fully-public connections with strangers.

4.  4th Gen: mobile platforms

    Some 3rd gen chat platforms successfully extended to mobile platforms. New mobile-first platforms arose as OTT services.
    
    -   Skype
    
    -   iChat
    
    -   WhatsApp
    
    -   Viber

5.  5th Gen: multi-user social chat with multimedia integration and mobile support

    5th Gen systems work with a broad palette of features. No longer limited by technology, 5th Gen systems differ in their choice of design tradeoffs. They differentiate along dimensions of etiquette and the aesthetics of the user experience.

### Affordances of Text Chat

The differences between text chat systems can be articulated using the following (incomplete) list:

-   threading

-   highlighting

-   scrollback

-   logging

-   bots

-   etiquette conventions

-   out of office autoreply

-   gateways between multiple protocols

-   presence notification

-   sync vs async

-   the idea of lag

-   the idea of netsplits

-   the idea of channels

-   the idea of editability

-   lurking (active vs peripheral participation)

-   group chat vs 1-to-1

-   different status levels (regular, chanop, oper)

-   reputation system ranking

-   degree of technical skill required to use the medium &#x2013; is the primary interface Terminal or Browser?

-   maximum message length

-   which then gave rise to URL shorteners

-   support for plain text vs HTML

-   are images embeddable?

-   support for file transfers

### Major Columns in the Periodic Table of Protocols

-   one-to-many push = announcement mailing lists

-   one-to-many pull = blogs

-   many-to-many push = discussion mailing lists

-   one-to-one realtime chat

-   one-to-one and one-to-few asynchronous email

-   near-synchronous collaborative editable content (wiki, writely, google docs)

-   democratized one-to-many content sharing (photos, video, text = flickr, youtube, blogs)

# Pricing, or How We Make Money

We're still brainstorming ways to make money. This list is a starting point.

## Anti-abuse Features

Open communities inevitably attract abuse. Other media have evolved the idea of anti-spam as a paid service. We will do that too.

## Paid Moderation

A community manager can claim a chatstream by paying to register as a chatstream owner. Administrator privileges follow.

## Hosted Moderation

Community managers can delegate moderation responsibilities to Scrollback's staff of trained community managers, on a paid basis.

## Private Chats

All chats are public by default.

If you want to have a private chat to discuss confidential company business, you need to be a paying moderator.

## Up arrow to edit past chats

# Support

# FAQ

## Can I talk to my friends on existing chat networks?

Not yet.

## I don't want to use Scrollback. What else should I look at?

Check out:

### <http://www.discourse.org/> (still in development)

### <http://www.oovoo.com/home.aspx> (integrates with FB Messenger, but maximum of 12 users per chat)

### Good Old IRC (a variety of web clients are available, but seriously, just use Scrollback)

### Barc.com

## Is Scrollback open-source software?

*I want to download and install Scrollback for myself. Can I?*

We offer Scrollback offered as a hosted service, just as Github offers git as a hosted service.

But if you want to download the source and host Scrollback yourself, you can.

Download.
