import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
declare var $: JQueryStatic;

@Component({
    selector: 'top-nav',
    styleUrls: ['topnav.component.scss'],
    templateUrl: 'topnav.component.html',
})

export class TopNavComponent implements OnInit {
    searchWord: string;

    isCollapsed = true;
    user;

    constructor(private router: Router, private authService: AuthService) { }

    Search() {
        this.router.navigate(['/search', { b: this.searchWord }]);
    }

    ngOnInit() {
        this.authService.getSigninEvent().subscribe((user) => {
            this.user = user;
        });
    }

    /**
     * Change theme
     * @param  {string} color
     * @returns void
     */
    changeTheme(color: string): void {
        let link: any = $('<link>');
        link
            .appendTo('head')
            .attr({ type: 'text/css', rel: 'stylesheet' })
            .attr('href', 'themes/app-' + color + '.css');
    }

    rtl(): void {
        let body: any = $('body');
        body.toggleClass('rtl');
    }

    /**
     * Toggle SideBar
     * @returns void
     */
    sidebarToggler(): void {
        let sidebar: any = $('#sidebar');
        let mainContainer: any = $('.main-container');
        sidebar.toggleClass('sidebar-left-zero');
        mainContainer.toggleClass('main-container-ml-zero');
    }
}