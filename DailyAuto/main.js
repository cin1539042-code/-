(async function () {
  // 每日一键启动：启动游戏 + 每日委托 + 清体力 + 下线
  async function runDaily() {
    const gamePath = settings.gamePath || "D:\\Genshin Impact\\GenshinImpact.exe";
    const waitTime = parseInt(settings.waitTime, 10) || 60000;
    const domainName = settings.domainName || "铭记之谷";
    const domainTimes = parseInt(settings.domainTimes, 10) || 5;
    const useResin = settings.useResin !== false;

    // 1. 启动原神
    await dispatcher.runTask(
      new SoloTask("LaunchGame", {
        path: gamePath,
        waitTime: waitTime
      })
    );

    // 2. 启用实时任务：自动拾取、自动对话、自动派遣
    dispatcher.addTimer(new RealtimeTimer("AutoPick"));
    dispatcher.addTimer(new RealtimeTimer("AutoDialog"));
    dispatcher.addTimer(new RealtimeTimer("AutoExpedition"));

    // 3. 执行每日委托一条龙
    await dispatcher.runTask(new SoloTask("DailyCommission"));

    // 4. 清体力：自动刷指定秘境
    await dispatcher.runTask(
      new SoloTask("AutoDomain", {
        domainName: domainName,
        times: domainTimes,
        useResin: useResin
      })
    );

    // 5. 完成后关闭游戏
    await dispatcher.runTask(new SoloTask("CloseGame"));
  }

  await runDaily();
})().catch(console.error);
