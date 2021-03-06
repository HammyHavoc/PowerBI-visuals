﻿/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved. 
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *   
 *  The above copyright notice and this permission notice shall be included in 
 *  all copies or substantial portions of the Software.
 *   
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/// <reference path="../_references.ts"/>

module powerbi.visuals {
    export interface VisualBackground {
        imageFit?: string;
        imageUrl?: string;
        imageName?: string;
        transparency?: number;
    }

    export module visualBackgroundHelper {
        export function getDefaultColor(): string {
            return '#FFF';
        }

        export function getDefaultTransparency(): number {
            return 50;
        }

        export function getDefaultShow(): boolean {
            return true;
        }

        export function getDefaultValues() {
            return {
                color: getDefaultColor(),
                transparency: getDefaultTransparency(),
                show: getDefaultShow()
            };
        }

        export function getDefaultImageFit(): string {
            return imageScalingType.normal;
        }

        export function getDefaultImageName(): string {
            return null;
        }

        export function getDefaultImageUrl(): string {
            return null;
        }

        export function enumeratePlot(enumeration: ObjectEnumerationBuilder, background: VisualBackground, backgroundImageEnabled: boolean): void {
            // featureSwitch
            if (!background || !backgroundImageEnabled)
                return;

            let backgroundObject: VisualObjectInstance = {
                selector: null,
                properties: {
                    imageUrl: {
                        imageUrl: background.imageUrl ? background.imageUrl : getDefaultImageUrl(),
                        imageName: background.imageName ? background.imageName : getDefaultImageName(),
                    },
                    imageFit: background.imageFit ? background.imageFit : getDefaultImageFit(),
                    transparency: background.transparency ? background.transparency : getDefaultTransparency(),
                },
                objectName: 'plotArea',
            };

            enumeration.pushInstance(backgroundObject);
        }

        export function renderBackgroundImage(
            background: VisualBackground,
            visualElement: JQuery,
            availableWidth: number,
            availableHeight: number,
            marginLeft: number,
            marginBottom: number): void {
            let imageUrl = background && background.imageUrl;
            let imageFit = background && background.imageFit;
            let imageTransparency = background && background.transparency;
            let backgroundImage = visualElement.children('.background-image');

            // If there were image and it was removed
            if (!imageUrl) {
                if (backgroundImage.length !== 0)
                    backgroundImage.remove();
                return;
            }

            // If this is the first edit of the image
            if (backgroundImage.length === 0) {
                // Place the div only if the image exists in order to keep the html as clean as possible
                visualElement.prepend('<div class="background-image"></div>');
                backgroundImage = visualElement.children('.background-image');

                // the div should be positioned absolute in order to get on top of the sibling svg
                backgroundImage.css('position', 'absolute');
            }

            // Get the size and margins from the visual for the div will placed inside the plot area
            backgroundImage.css({
                'width': availableWidth,
                'height': availableHeight,
                'left': marginLeft,
                'bottom': marginBottom,
            });

            // Background properties
            backgroundImage.css({
                'background-image': 'url(' + imageUrl + ')',
                'background-repeat': 'no-repeat',
                'opacity': (100 - imageTransparency) / 100,
            });

            switch (imageFit) {
                // The image will be centered in its initial size
                case visuals.imageScalingType.normal: {
                    backgroundImage.css({
                        'background-size': '',
                        'background-position': '50% 50%',
                    });
                    break;
                }
                // The image will be streched all over the background
                case visuals.imageScalingType.fit: {
                    backgroundImage.css({
                        'background-size': '100% 100%',
                        'background-position': '',
                    });
                    break;
                }
                // The image will stretch on the width and the height will scale accordingly
                case visuals.imageScalingType.fill: {
                    backgroundImage.css({
                        'background-size': '100%',
                        'background-position': '50% 50%',
                    });
                    break;
                }
                default: {
                    backgroundImage.css({
                        'background-size': '',
                        'background-position': '50% 50%',
                    });
                    break;
                }
            }
        }
    }
} 