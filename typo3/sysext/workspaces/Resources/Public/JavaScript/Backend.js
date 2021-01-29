/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};define(["require","exports","jquery","TYPO3/CMS/Backend/Enum/Severity","./Workspaces","TYPO3/CMS/Backend/Modal","TYPO3/CMS/Backend/Storage/Persistent","TYPO3/CMS/Backend/Tooltip","TYPO3/CMS/Backend/Utility","TYPO3/CMS/Backend/Viewport","TYPO3/CMS/Backend/Wizard","TYPO3/CMS/Core/SecurityUtility","TYPO3/CMS/Backend/WindowManager","nprogress","TYPO3/CMS/Backend/Input/Clearable"],(function(e,t,a,s,n,i,o,l,r,d,c,p,g){"use strict";var h;a=__importDefault(a),n=__importDefault(n),function(e){e.searchForm="#workspace-settings-form",e.searchTextField='#workspace-settings-form input[name="search-text"]',e.searchSubmitBtn='#workspace-settings-form button[type="submit"]',e.depthSelector='#workspace-settings-form [name="depth"]',e.languageSelector='#workspace-settings-form select[name="languages"]',e.chooseStageAction='#workspace-actions-form [name="stage-action"]',e.chooseSelectionAction='#workspace-actions-form [name="selection-action"]',e.chooseMassAction='#workspace-actions-form [name="mass-action"]',e.container="#workspace-panel",e.actionIcons="#workspace-action-icons",e.toggleAll=".t3js-toggle-all",e.previewLinksButton=".t3js-preview-link",e.pagination="#workspace-pagination"}(h||(h={}));class u extends n.default{constructor(){super(),this.elements={},this.settings={dir:"ASC",id:TYPO3.settings.Workspaces.id,language:TYPO3.settings.Workspaces.language,limit:30,query:"",sort:"label_Live",start:0,filterTxt:""},this.paging={currentPage:1,totalPages:1,totalItems:0},this.allToggled=!1,this.latestPath="",this.markedRecordsForMassAction=[],this.indentationPadding=26,this.handleCheckboxChange=e=>{const t=a.default(e.currentTarget),s=t.parents("tr"),n=s.data("table")+":"+s.data("uid")+":"+s.data("t3ver_oid");if(t.prop("checked"))this.markedRecordsForMassAction.push(n),s.addClass("warning");else{const e=this.markedRecordsForMassAction.indexOf(n);e>-1&&this.markedRecordsForMassAction.splice(e,1),s.removeClass("warning")}this.elements.$chooseStageAction.prop("disabled",0===this.markedRecordsForMassAction.length),this.elements.$chooseSelectionAction.prop("disabled",0===this.markedRecordsForMassAction.length),this.elements.$chooseMassAction.prop("disabled",this.markedRecordsForMassAction.length>0)},this.viewChanges=e=>{e.preventDefault();const t=a.default(e.currentTarget).closest("tr");this.sendRemoteRequest(this.generateRemotePayload("getRowDetails",{stage:t.data("stage"),t3ver_oid:t.data("t3ver_oid"),table:t.data("table"),uid:t.data("uid")})).then(async e=>{const n=(await e.resolve())[0].result.data[0],o=a.default("<div />"),l=a.default("<ul />",{class:"nav nav-tabs",role:"tablist"}),r=a.default("<div />",{class:"tab-content"}),d=[];o.append(a.default("<p />").html(TYPO3.lang.path.replace("{0}",n.path_Live)),a.default("<p />").html(TYPO3.lang.current_step.replace("{0}",n.label_Stage).replace("{1}",n.stage_position).replace("{2}",n.stage_count))),n.diff.length>0&&(l.append(a.default("<li />",{role:"presentation",class:"nav-item"}).append(a.default("<a />",{class:"nav-link",href:"#workspace-changes","aria-controls":"workspace-changes",role:"tab","data-bs-toggle":"tab"}).text(TYPO3.lang["window.recordChanges.tabs.changeSummary"]))),r.append(a.default("<div />",{role:"tabpanel",class:"tab-pane",id:"workspace-changes"}).append(a.default("<div />",{class:"form-section"}).append(u.generateDiffView(n.diff))))),n.comments.length>0&&(l.append(a.default("<li />",{role:"presentation",class:"nav-item"}).append(a.default("<a />",{class:"nav-link",href:"#workspace-comments","aria-controls":"workspace-comments",role:"tab","data-bs-toggle":"tab"}).html(TYPO3.lang["window.recordChanges.tabs.comments"]+"&nbsp;").append(a.default("<span />",{class:"badge"}).text(n.comments.length)))),r.append(a.default("<div />",{role:"tabpanel",class:"tab-pane",id:"workspace-comments"}).append(a.default("<div />",{class:"form-section"}).append(u.generateCommentView(n.comments))))),n.history.total>0&&(l.append(a.default("<li />",{role:"presentation",class:"nav-item"}).append(a.default("<a />",{class:"nav-link",href:"#workspace-history","aria-controls":"workspace-history",role:"tab","data-bs-toggle":"tab"}).text(TYPO3.lang["window.recordChanges.tabs.history"]))),r.append(a.default("<div />",{role:"tabpanel",class:"tab-pane",id:"workspace-history"}).append(a.default("<div />",{class:"form-section"}).append(u.generateHistoryView(n.history.data))))),l.find("li").first().addClass("active"),r.find(".tab-pane").first().addClass("active"),o.append(a.default("<div />").append(l,r)),!1!==n.label_PrevStage&&t.data("stage")!==t.data("prevStage")&&d.push({text:n.label_PrevStage.title,active:!0,btnClass:"btn-default",name:"prevstage",trigger:()=>{i.currentModal.trigger("modal-dismiss"),this.sendToStage(t,"prev")}}),!1!==n.label_NextStage&&d.push({text:n.label_NextStage.title,active:!0,btnClass:"btn-default",name:"nextstage",trigger:()=>{i.currentModal.trigger("modal-dismiss"),this.sendToStage(t,"next")}}),d.push({text:TYPO3.lang.close,active:!0,btnClass:"btn-info",name:"cancel",trigger:()=>{i.currentModal.trigger("modal-dismiss")}}),i.advanced({type:i.types.default,title:TYPO3.lang["window.recordInformation"].replace("{0}",t.find(".t3js-title-live").text().trim()),content:o,severity:s.SeverityEnum.info,buttons:d,size:i.sizes.medium})})},this.confirmDeleteRecordFromWorkspace=e=>{const t=a.default(e.target).closest("tr"),n=i.confirm(TYPO3.lang["window.discard.title"],TYPO3.lang["window.discard.message"],s.SeverityEnum.warning,[{text:TYPO3.lang.cancel,active:!0,btnClass:"btn-default",name:"cancel",trigger:()=>{n.modal("hide")}},{text:TYPO3.lang.ok,btnClass:"btn-warning",name:"ok"}]);n.on("button.clicked",e=>{"ok"===e.target.name&&this.sendRemoteRequest([this.generateRemoteActionsPayload("deleteSingleRecord",[t.data("table"),t.data("uid")])]).then(()=>{n.modal("hide"),this.getWorkspaceInfos(),u.refreshPageTree()})})},this.runSelectionAction=()=>{const e=this.elements.$chooseSelectionAction.val(),t="discard"!==e;if(0===e.length)return;const a=[];for(let e=0;e<this.markedRecordsForMassAction.length;++e){const t=this.markedRecordsForMassAction[e].split(":");a.push({table:t[0],liveId:t[2],versionId:t[1]})}t?this.checkIntegrity({selection:a,type:"selection"}).then(async t=>{c.setForceSelection(!1),"warning"===(await t.resolve())[0].result.result&&this.addIntegrityCheckWarningToWizard(),this.renderSelectionActionWizard(e,a)}):(c.setForceSelection(!1),this.renderSelectionActionWizard(e,a))},this.addIntegrityCheckWarningToWizard=()=>{c.addSlide("integrity-warning","Warning",TYPO3.lang["integrity.hasIssuesDescription"]+"<br>"+TYPO3.lang["integrity.hasIssuesQuestion"],s.SeverityEnum.warning)},this.runMassAction=()=>{const e=this.elements.$chooseMassAction.val(),t="discard"!==e;0!==e.length&&(t?this.checkIntegrity({language:this.settings.language,type:e}).then(async t=>{c.setForceSelection(!1),"warning"===(await t.resolve())[0].result.result&&this.addIntegrityCheckWarningToWizard(),this.renderMassActionWizard(e)}):(c.setForceSelection(!1),this.renderMassActionWizard(e)))},this.sendToSpecificStageAction=e=>{const t=[],s=a.default(e.currentTarget).val();for(let e=0;e<this.markedRecordsForMassAction.length;++e){const a=this.markedRecordsForMassAction[e].split(":");t.push({table:a[0],uid:a[1],t3ver_oid:a[2]})}this.sendRemoteRequest(this.generateRemoteActionsPayload("sendToSpecificStageWindow",[s,t])).then(async e=>{const a=this.renderSendToStageWindow(await e.resolve());a.on("button.clicked",e=>{if("ok"===e.target.name){const n=r.convertFormToObject(e.currentTarget.querySelector("form"));n.affects={elements:t,nextStage:s},this.sendRemoteRequest([this.generateRemoteActionsPayload("sendToSpecificStageExecute",[n]),this.generateRemotePayload("getWorkspaceInfos",this.settings)]).then(async e=>{const t=await e.resolve();a.modal("hide"),this.renderWorkspaceInfos(t[1].result),u.refreshPageTree()})}}).on("modal-destroyed",()=>{this.elements.$chooseStageAction.val("")})})},this.generatePreviewLinks=()=>{this.sendRemoteRequest(this.generateRemoteActionsPayload("generateWorkspacePreviewLinksForAllLanguages",[this.settings.id])).then(async e=>{const t=(await e.resolve())[0].result,n=a.default("<dl />");a.default.each(t,(e,t)=>{n.append(a.default("<dt />").text(e),a.default("<dd />").append(a.default("<a />",{href:t,target:"_blank"}).text(t)))}),i.show(TYPO3.lang.previewLink,n,s.SeverityEnum.info,[{text:TYPO3.lang.ok,active:!0,btnClass:"btn-info",name:"ok",trigger:()=>{i.currentModal.trigger("modal-dismiss")}}],["modal-inner-scroll"])})},a.default(()=>{let e;this.getElements(),this.registerEvents(),o.isset("this.Module.depth")?(e=o.get("this.Module.depth"),this.elements.$depthSelector.val(e),this.settings.depth=e):this.settings.depth=TYPO3.settings.Workspaces.depth,this.loadWorkspaceComponents()})}static refreshPageTree(){d.NavigationContainer&&d.NavigationContainer.PageTree&&d.NavigationContainer.PageTree.refreshTree()}static generateDiffView(e){const t=a.default("<div />",{class:"diff"});for(let s of e)t.append(a.default("<div />",{class:"diff-item"}).append(a.default("<div />",{class:"diff-item-title"}).text(s.label),a.default("<div />",{class:"diff-item-result diff-item-result-inline"}).html(s.content)));return t}static generateCommentView(e){const t=a.default("<div />");for(let s of e){const e=a.default("<div />",{class:"panel panel-default"});s.user_comment.length>0&&e.append(a.default("<div />",{class:"panel-body"}).html(s.user_comment)),e.append(a.default("<div />",{class:"panel-footer"}).append(a.default("<span />",{class:"label label-success"}).text(s.stage_title),a.default("<span />",{class:"label label-info"}).text(s.tstamp))),t.append(a.default("<div />",{class:"media"}).append(a.default("<div />",{class:"media-left text-center"}).text(s.user_username).prepend(a.default("<div />").html(s.user_avatar)),a.default("<div />",{class:"media-body"}).append(e)))}return t}static generateHistoryView(e){const t=a.default("<div />");for(let s of e){const e=a.default("<div />",{class:"panel panel-default"});let n;if("object"==typeof s.differences){if(0===s.differences.length)continue;n=a.default("<div />",{class:"diff"});for(let e=0;e<s.differences.length;++e)n.append(a.default("<div />",{class:"diff-item"}).append(a.default("<div />",{class:"diff-item-title"}).text(s.differences[e].label),a.default("<div />",{class:"diff-item-result diff-item-result-inline"}).html(s.differences[e].html)));e.append(a.default("<div />").append(n))}else e.append(a.default("<div />",{class:"panel-body"}).text(s.differences));e.append(a.default("<div />",{class:"panel-footer"}).append(a.default("<span />",{class:"label label-info"}).text(s.datetime))),t.append(a.default("<div />",{class:"media"}).append(a.default("<div />",{class:"media-left text-center"}).text(s.user).prepend(a.default("<div />").html(s.user_avatar)),a.default("<div />",{class:"media-body"}).append(e)))}return t}getElements(){this.elements.$searchForm=a.default(h.searchForm),this.elements.$searchTextField=a.default(h.searchTextField),this.elements.$searchSubmitBtn=a.default(h.searchSubmitBtn),this.elements.$depthSelector=a.default(h.depthSelector),this.elements.$languageSelector=a.default(h.languageSelector),this.elements.$container=a.default(h.container),this.elements.$tableBody=this.elements.$container.find("tbody"),this.elements.$actionIcons=a.default(h.actionIcons),this.elements.$toggleAll=a.default(h.toggleAll),this.elements.$chooseStageAction=a.default(h.chooseStageAction),this.elements.$chooseSelectionAction=a.default(h.chooseSelectionAction),this.elements.$chooseMassAction=a.default(h.chooseMassAction),this.elements.$previewLinksButton=a.default(h.previewLinksButton),this.elements.$pagination=a.default(h.pagination)}registerEvents(){a.default(document).on("click",'[data-action="publish"]',e=>{const t=e.target.closest("tr");this.checkIntegrity({selection:[{liveId:t.dataset.uid,versionId:t.dataset.t3ver_oid,table:t.dataset.table}],type:"selection"}).then(async e=>{"warning"===(await e.resolve())[0].result.result&&this.addIntegrityCheckWarningToWizard(),c.setForceSelection(!1),c.addSlide("publish-confirm","Publish",TYPO3.lang["window.publish.message"],s.SeverityEnum.info),c.addFinalProcessingSlide(()=>{this.sendRemoteRequest(this.generateRemoteActionsPayload("publishSingleRecord",[t.dataset.table,t.dataset.t3ver_oid,t.dataset.uid])).then(()=>{c.dismiss(),this.getWorkspaceInfos(),u.refreshPageTree()})}).done(()=>{c.show()})})}).on("click",'[data-action="prevstage"]',e=>{this.sendToStage(a.default(e.currentTarget).closest("tr"),"prev")}).on("click",'[data-action="nextstage"]',e=>{this.sendToStage(a.default(e.currentTarget).closest("tr"),"next")}).on("click",'[data-action="changes"]',this.viewChanges).on("click",'[data-action="preview"]',this.openPreview.bind(this)).on("click",'[data-action="open"]',e=>{const t=e.currentTarget.closest("tr");let a=TYPO3.settings.FormEngine.moduleUrl+"&returnUrl="+encodeURIComponent(document.location.href)+"&id="+TYPO3.settings.Workspaces.id+"&edit["+t.dataset.table+"]["+t.dataset.uid+"]=edit";window.location.href=a}).on("click",'[data-action="version"]',e=>{const t=e.currentTarget.closest("tr"),a="pages"===t.dataset.table?t.dataset.t3ver_oid:t.dataset.pid;window.location.href=top.TYPO3.configuration.pageModuleUrl+"&id="+a+"&returnUrl="+encodeURIComponent(window.location.href)}).on("click",'[data-action="remove"]',this.confirmDeleteRecordFromWorkspace).on("click",'[data-action="expand"]',e=>{const t=a.default(e.currentTarget);let s;s="true"===t.first().attr("aria-expanded")?"apps-pagetree-expand":"apps-pagetree-collapse",t.empty().append(this.getPreRenderedIcon(s))}),a.default(window.top.document).on("click",".t3js-workspace-recipients-selectall",()=>{a.default(".t3js-workspace-recipient",window.top.document).not(":disabled").prop("checked",!0)}).on("click",".t3js-workspace-recipients-deselectall",()=>{a.default(".t3js-workspace-recipient",window.top.document).not(":disabled").prop("checked",!1)}),this.elements.$searchForm.on("submit",e=>{e.preventDefault(),this.settings.filterTxt=this.elements.$searchTextField.val(),this.getWorkspaceInfos()}),this.elements.$searchTextField.on("keyup",e=>{""!==e.target.value?this.elements.$searchSubmitBtn.removeClass("disabled"):(this.elements.$searchSubmitBtn.addClass("disabled"),this.getWorkspaceInfos())}),this.elements.$searchTextField.get(0).clearable({onClear:()=>{this.elements.$searchSubmitBtn.addClass("disabled"),this.settings.filterTxt="",this.getWorkspaceInfos()}}),this.elements.$toggleAll.on("click",()=>{this.allToggled=!this.allToggled,this.elements.$tableBody.find('input[type="checkbox"]').prop("checked",this.allToggled).trigger("change")}),this.elements.$tableBody.on("change","tr input[type=checkbox]",this.handleCheckboxChange),this.elements.$depthSelector.on("change",e=>{const t=e.target.value;o.set("this.Module.depth",t),this.settings.depth=t,this.getWorkspaceInfos()}),this.elements.$previewLinksButton.on("click",this.generatePreviewLinks),this.elements.$languageSelector.on("change",e=>{const t=a.default(e.target);this.settings.language=t.val(),this.sendRemoteRequest([this.generateRemoteActionsPayload("saveLanguageSelection",[t.val()]),this.generateRemotePayload("getWorkspaceInfos",this.settings)]).then(e=>{this.elements.$languageSelector.prev().html(t.find(":selected").data("icon")),this.renderWorkspaceInfos(e[1].result)})}),this.elements.$chooseStageAction.on("change",this.sendToSpecificStageAction),this.elements.$chooseSelectionAction.on("change",this.runSelectionAction),this.elements.$chooseMassAction.on("change",this.runMassAction),this.elements.$pagination.on("click","a[data-action]",e=>{e.preventDefault();const t=a.default(e.currentTarget);let s=!1;switch(t.data("action")){case"previous":this.paging.currentPage>1&&(this.paging.currentPage--,s=!0);break;case"next":this.paging.currentPage<this.paging.totalPages&&(this.paging.currentPage++,s=!0);break;case"page":this.paging.currentPage=parseInt(t.data("page"),10),s=!0;break;default:throw'Unknown action "'+t.data("action")+'"'}s&&(this.settings.start=parseInt(this.settings.limit.toString(),10)*(this.paging.currentPage-1),this.getWorkspaceInfos())})}sendToStage(e,t){let a,s,n;if("next"===t)a=e.data("nextStage"),s="sendToNextStageWindow",n="sendToNextStageExecute";else{if("prev"!==t)throw"Invalid direction given.";a=e.data("prevStage"),s="sendToPrevStageWindow",n="sendToPrevStageExecute"}this.sendRemoteRequest(this.generateRemoteActionsPayload(s,[e.data("uid"),e.data("table"),e.data("t3ver_oid")])).then(async t=>{const s=this.renderSendToStageWindow(await t.resolve());s.on("button.clicked",t=>{if("ok"===t.target.name){const i=r.convertFormToObject(t.currentTarget.querySelector("form"));i.affects={table:e.data("table"),nextStage:a,t3ver_oid:e.data("t3ver_oid"),uid:e.data("uid"),elements:[]},this.sendRemoteRequest([this.generateRemoteActionsPayload(n,[i]),this.generateRemotePayload("getWorkspaceInfos",this.settings)]).then(async e=>{const t=await e.resolve();s.modal("hide"),this.renderWorkspaceInfos(t[1].result),u.refreshPageTree()})}})})}loadWorkspaceComponents(){this.sendRemoteRequest([this.generateRemotePayload("getWorkspaceInfos",this.settings),this.generateRemotePayload("getStageActions",{}),this.generateRemoteMassActionsPayload("getMassStageActions",{}),this.generateRemotePayload("getSystemLanguages",{pageUid:this.elements.$container.data("pageUid")})]).then(async e=>{const t=await e.resolve();this.elements.$depthSelector.prop("disabled",!1),this.renderWorkspaceInfos(t[0].result);const s=t[1].result.data;let n;for(n=0;n<s.length;++n)this.elements.$chooseStageAction.append(a.default("<option />").val(s[n].uid).text(s[n].title));const i=t[2].result.data;for(n=0;n<i.length;++n)this.elements.$chooseSelectionAction.append(a.default("<option />").val(i[n].action).text(i[n].title)),this.elements.$chooseMassAction.append(a.default("<option />").val(i[n].action).text(i[n].title));const o=t[3].result.data;for(n=0;n<o.length;++n){const e=a.default("<option />").val(o[n].uid).text(o[n].title).data("icon",o[n].icon);String(o[n].uid)===String(TYPO3.settings.Workspaces.language)&&(e.prop("selected",!0),this.elements.$languageSelector.prev().html(o[n].icon)),this.elements.$languageSelector.append(e)}this.elements.$languageSelector.prop("disabled",!1)})}getWorkspaceInfos(){this.sendRemoteRequest(this.generateRemotePayload("getWorkspaceInfos",this.settings)).then(async e=>{this.renderWorkspaceInfos((await e.resolve())[0].result)})}renderWorkspaceInfos(e){this.elements.$tableBody.children().remove(),this.allToggled=!1,this.elements.$chooseStageAction.prop("disabled",!0),this.elements.$chooseSelectionAction.prop("disabled",!0),this.elements.$chooseMassAction.prop("disabled",0===e.data.length),this.buildPagination(e.total);for(let t=0;t<e.data.length;++t){const s=e.data[t],n=a.default("<div />",{class:"btn-group"});let i;n.append(this.getAction(s.Workspaces_CollectionChildren>0&&""!==s.Workspaces_CollectionCurrent,"expand","apps-pagetree-collapse").attr("title",TYPO3.lang["tooltip.expand"]).attr("data-bs-target",'[data-collection="'+s.Workspaces_CollectionCurrent+'"]').attr("data-bs-toggle","collapse"),this.getAction(s.hasChanges,"changes","actions-document-info").attr("title",TYPO3.lang["tooltip.showChanges"]),this.getAction(s.allowedAction_publish&&""===s.Workspaces_CollectionParent,"publish","actions-version-swap-version").attr("title",TYPO3.lang["tooltip.publish"]),this.getAction(s.allowedAction_view,"preview","actions-version-workspace-preview").attr("title",TYPO3.lang["tooltip.viewElementAction"]),this.getAction(s.allowedAction_edit,"open","actions-open").attr("title",TYPO3.lang["tooltip.editElementAction"]),this.getAction(!0,"version","actions-version-page-open").attr("title",TYPO3.lang["tooltip.openPage"]),this.getAction(s.allowedAction_delete,"remove","actions-version-document-remove").attr("title",TYPO3.lang["tooltip.discardVersion"])),""!==s.integrity.messages&&(i=a.default(TYPO3.settings.Workspaces.icons[s.integrity.status]),i.attr("data-bs-toggle","tooltip").attr("data-bs-placement","top").attr("data-bs-html","true").attr("title",s.integrity.messages)),this.latestPath!==s.path_Workspace&&(this.latestPath=s.path_Workspace,this.elements.$tableBody.append(a.default("<tr />").append(a.default("<th />"),a.default("<th />",{colspan:6}).html('<span title="'+s.path_Workspace+'">'+s.path_Workspace_crop+"</span>"))));const o=a.default("<label />",{class:"btn btn-default btn-checkbox"}).append(a.default("<input />",{type:"checkbox"}),a.default("<span />",{class:"t3-icon fa"})),r={"data-uid":s.uid,"data-pid":s.livepid,"data-t3ver_oid":s.t3ver_oid,"data-t3ver_wsid":s.t3ver_wsid,"data-table":s.table,"data-next-stage":s.value_nextStage,"data-prev-stage":s.value_prevStage,"data-stage":s.stage};""!==s.Workspaces_CollectionParent&&(r["data-collection"]=s.Workspaces_CollectionParent,r.class="collapse"),this.elements.$tableBody.append(a.default("<tr />",r).append(a.default("<td />").empty().append(o),a.default("<td />",{class:"t3js-title-workspace",style:s.Workspaces_CollectionLevel>0?"padding-left: "+this.indentationPadding*s.Workspaces_CollectionLevel+"px":""}).html(s.icon_Workspace+'&nbsp;<a href="#" data-action="changes"><span class="workspace-state-'+s.state_Workspace+'" title="'+s.label_Workspace+'">'+s.label_Workspace_crop+"</span></a>"),a.default("<td />",{class:"t3js-title-live"}).html(s.icon_Live+'&nbsp;<span class"workspace-live-title title="'+s.label_Live+'">'+s.label_Live_crop+"</span>"),a.default("<td />").text(s.label_Stage),a.default("<td />").empty().append(i),a.default("<td />").html(s.language.icon),a.default("<td />",{class:"text-right nowrap"}).append(n))),l.initialize('[data-bs-toggle="tooltip"]',{delay:{show:500,hide:100},trigger:"hover",container:"body"})}}buildPagination(e){if(0===e)return void this.elements.$pagination.contents().remove();if(this.paging.totalItems=e,this.paging.totalPages=Math.ceil(e/parseInt(this.settings.limit.toString(),10)),1===this.paging.totalPages)return void this.elements.$pagination.contents().remove();const t=a.default("<ul />",{class:"pagination"}),s=[],n=a.default("<li />",{class:"page-item"}).append(a.default("<a />",{class:"page-link","data-action":"previous"}).append(a.default("<span />",{class:"t3-icon fa fa-arrow-left"}))),i=a.default("<li />",{class:"page-item"}).append(a.default("<a />",{class:"page-link","data-action":"next"}).append(a.default("<span />",{class:"t3-icon fa fa-arrow-right"})));1===this.paging.currentPage&&n.disablePagingAction(),this.paging.currentPage===this.paging.totalPages&&i.disablePagingAction();for(let e=1;e<=this.paging.totalPages;e++){const t=a.default("<li />",{class:"page-item"+(this.paging.currentPage===e?" active":"")});t.append(a.default("<a />",{class:"page-link","data-action":"page","data-page":e}).append(a.default("<span />").text(e))),s.push(t)}t.append(n,s,i),this.elements.$pagination.empty().append(t)}openPreview(e){const t=a.default(e.currentTarget).closest("tr");this.sendRemoteRequest(this.generateRemoteActionsPayload("viewSingleRecord",[t.data("table"),t.data("uid")])).then(async e=>{const t=(await e.resolve())[0].result;g.localOpen(t)})}renderSelectionActionWizard(e,t){c.addSlide("mass-action-confirmation",TYPO3.lang["window.selectionAction.title"],"<p>"+(new p).encodeHtml(TYPO3.lang["tooltip."+e+"Selected"])+"</p>",s.SeverityEnum.warning),c.addFinalProcessingSlide(()=>{this.sendRemoteRequest(this.generateRemoteActionsPayload("executeSelectionAction",{action:e,selection:t})).then(()=>{this.markedRecordsForMassAction=[],this.getWorkspaceInfos(),c.dismiss(),u.refreshPageTree()})}).done(()=>{c.show(),c.getComponent().on("wizard-dismissed",()=>{this.elements.$chooseSelectionAction.val("")})})}renderMassActionWizard(e){let t;switch(e){case"publish":t="publishWorkspace";break;case"discard":t="flushWorkspace";break;default:throw"Invalid mass action "+e+" called."}const a=new p;c.setForceSelection(!1),c.addSlide("mass-action-confirmation",TYPO3.lang["window.massAction.title"],"<p>"+a.encodeHtml(TYPO3.lang["tooltip."+e+"All"])+"<br><br>"+a.encodeHtml(TYPO3.lang["tooltip.affectWholeWorkspace"])+"</p>",s.SeverityEnum.warning);const n=async e=>{const a=(await e.resolve())[0].result;a.processed<a.total?this.sendRemoteRequest(this.generateRemoteMassActionsPayload(t,a)).then(n):(this.getWorkspaceInfos(),c.dismiss())};c.addFinalProcessingSlide(()=>{this.sendRemoteRequest(this.generateRemoteMassActionsPayload(t,{init:!0,total:0,processed:0,language:this.settings.language})).then(n)}).done(()=>{c.show(),c.getComponent().on("wizard-dismissed",()=>{this.elements.$chooseMassAction.val("")})})}getAction(e,t,s){return e?a.default("<button />",{class:"btn btn-default","data-action":t,"data-bs-toggle":"tooltip"}).append(this.getPreRenderedIcon(s)):a.default("<span />",{class:"btn btn-default disabled"}).append(this.getPreRenderedIcon("empty-empty"))}getPreRenderedIcon(e){return this.elements.$actionIcons.find('[data-identifier="'+e+'"]').clone()}}return a.default.fn.disablePagingAction=function(){a.default(this).addClass("disabled").find(".t3-icon").unwrap().wrap(a.default("<span />",{class:"page-link"}))},new u}));